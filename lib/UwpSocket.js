import {Buffer} from 'buffer'
import {Duplex} from 'stream'
//import {process} from 'process'
import {errnoException} from './util'


var Streams = Windows.Storage.Streams
var DataWriter = Streams.DataWriter
var DataReader = Streams.DataReader

export default class UwpSocket extends Duplex {

	// exporting as static on class due to limitations of UMD format
	// to which this project compiles (until ESM is widely available)
	static errnoException = errnoException

	_connecting = false
	_connected = false
	destroyed = false
	_hadError = false
	// 64kB
	_maxChunkLength = 65536
	// this is the UWP StreamSocket 
	_handle = null

	constructor(...args) {
		super(...args)

		this._onConnect = this._onConnect.bind(this)
		this._readChunk = this._readChunk.bind(this)
		this._onRead = this._onRead.bind(this)

		// shut down the socket when we're finished with it.
		this.on('finish', this.destroy)

		this._initSocketHandle()
	}

	_initSocketHandle() {
		this.readable = false
		this.writable = false
		this.destroyed = false
		this.bytesRead = 0
		this._bytesWritten = 0
		this._hadError = false
	}

	connect(cb) {
		this._initSocketHandle()

		if (typeof cb === 'function') 
			this.once('connect', cb)

		this._connecting = true
		this.writable = true
	}

	_onConnect() {
		// .destroy() might have been called in meantime (right after .connect() but before connection was established)
		if (this.destroyed) return
		// setup state
		this._connecting = false
		this._connected = true
		// setup writer and writer. it needs to be ready to use in connect callback
		this._writer = new DataWriter(this._handle.outputStream)
		this.writable = true
		this._reader = new DataReader(this._handle.inputStream)
		this.readable = true
		// Make _reader.loadAsync read any ammount of bytes (basically right when any data arrive)
		// In other words: wont't wait for receiving all of the _maxChunkLength to call _onRead
		this._reader.inputStreamOptions = Streams.InputStreamOptions.partial
		// emit connect, at this point everything should be ready to write
		this.emit('connect')
		// start listening only after emiting connect, 'data' event can't preceed 'connect'
		this._readChunk()
		// start the first read, or get an immediate EOF.
		// this doesn't actually consume any bytes, because len=0.
		this.read(0)
	}

	_readChunk() {
		if (!(this._reader && this.readable)) return
		// sets up data listener and calls _onRead if (what a surprise) data is received
		this._reader
			.loadAsync(this._maxChunkLength)
			.done(this._onRead, err => this._onError(err, 'read'))
	}

	_onRead(chunkBytesRead) {
		if (chunkBytesRead == 0) {
			// server closed this socket, destroy this end too
			this.end()
			return
		}
		this.bytesRead += chunkBytesRead
		// received some data, load the into Node-like Buffer (Uint8 typed array) and emit
		var buffer = new Buffer(chunkBytesRead)
		// read data from DataReder into given buffer array
		this._reader.readBytes(buffer)
		this.push(buffer)
		// TODO: apply backpressure (pause receiving data) if push returns false
		// keep receiving next data
		setImmediate(this._readChunk)
	}

	_onError(err, syscall, address, port) {
		// TODO investigate - should multiple errors be merged into one?
		// probable case - .end() during both reading and writing will (maybe) cause two errors? just a thought thou...

		// probably just some error of not finished read/write due to calling cancelIOAsync in .end()
		if (this.destroyed) return
		this._connecting = false
		this._hadError = true
		//process.nextTick(connectErrorNT, this, errnoException(err, syscall, address, port))
		//process.nextTick(() => {
		setImmediate(() => {
			this.emit('error', errnoException(err, syscall, address, port))
			this.destroy()
		})
	}


	//////////////////////////////// END & DESTROY ////////////////////////////////////////

	end(data, encoding) {
		if (!this._connecting && !this._connected) {
			// .end() was called before .connect() do nothing
			// Duplex.prototype.write has to be called to ensure throwing error (write after end)
			Duplex.prototype.end.call(this, data, encoding)
			return
		}
		if (this._connecting) {
			this.once('connect', () => this.end(data, encoding))
			//setImmediate(() => this.end(data, encoding))
			return
		}
		// Duplex.prototype.write has to be called to ensure throwing error (write after end)
		// WARNING: Duplex.end() calls this.destroy
		Duplex.prototype.end.call(this, data, encoding)
		this._willEmitEnd = true
		if (this.readable && !this._readableState.endEmitted) {
			this.read(0)
		}
	}

	destroy(exception, cb) {
		// .destroy() called before .connect() do nothing
		if (!this._connecting && !this._connected) return

		var fireErrorCallbacks = () => {
			if (cb) cb(exception)
			if (exception && !this._writableState.errorEmitted) {
				//process.nextTick(emitErrorNT, this, new Error(exception))
				setImmediate(() => this.emit('error', new Error(exception)))
				//setImmediate(() => this.emit('error', new Error(exception)))
				this._writableState.errorEmitted = true
			}
		}

		// already destroyed, fire error callbacks
		if (this.destroyed) return fireErrorCallbacks()

		// stream is no more readable (won't be sending anything to server)
		// but it remains readable since some data from server might be already
		// on the way or in buffer waiting to be emitted
		this.writable = false
		// calling destroy with argument causes error and 'close' event callback argument to be true
		this._hadError = this._hadError || !!exception
		// we set destroyed to true before firing error callbacks in order
		// to make its re-entrance safe in case Socket.prototype.destroy()
		// is called within callbacks
		this.destroyed = true
		fireErrorCallbacks()
		this._connecting = false
		this._connected = false

		this._destroyHandle()
	}
	_destroyHandle() {
		// why the setImmediate?
		// cancelIOAsync might call the callback synchronously if there's no pending read/write
		// but it needs to be async - to properly react to errors (Error: write after end).
		// Also .end() (unlike .destroy() ) gives reader/writer some head start to finish reading.
		// Writer has to stop sending whatever is in buffer and send FIN packet to gracefuly close connection. 
		setImmediate(() => {
			if (this._handle == null) return
			// disabling readable here instead of in _destroyHandle2() to make reading safer
			// (to prevent Error reading in inappropriate time)
			this.readable = false
			// CancelIOAsync cancels pending writes and reads, but if there is a write buffer pending
			// in networking drivers, it flushes the write.
			var _destroyHandle2 = this._destroyHandle2.bind(this)
			this._handle.cancelIOAsync().done(_destroyHandle2, _destroyHandle2)
			// TODO investigate - does this need any futher error handling?
		})
	}
	_destroyHandle2() {
		if (this._handle) {
			try {
				this._handle.close()
			} catch(e) {}
			this._handle = null
		}
		if (this._writer) {
			// might be writing at the moment
			try {
				this._writer.detachStream()
			} catch(e) {}
			// TODO invesitagate - does this need any further error handling? Or will the writer just burn in flames on it's own?
			this._writer = null
		}
		if (this._reader) {
			// might be reading at the moment
			try {
				this._reader.detachStream()
			} catch(e) {}
			// TODO invesitagate - does this need any further error handling? Or will the reader just burn in flames on it's own?
			this._reader = null
		}

		if (this._willEmitEnd && !this._readableState.endEmitted) {
			// either we closed the socket or server disconnected us and WinRT didn't give us EOF
			// so we have to simulate it by pushing null to data. (in other word: this emits 'end')
			this.push(null)
			this.once('end', () => this.emit('close', this._hadError))
		} else {
			this.emit('close', this._hadError)
		}

	}


	//////////////////////////////// READ / WRITE ////////////////////////////////////////

	get bufferSize() {
		// returns undefined before socket.connect()
		if (this._connecting || this._connected)
			return this._writableState.length
	}

	// The amount of received bytes.
	bytesRead = 0
	
	// The ammount of bytes sent
	get bytesWritten() {
		return this._bytesWritten + (this.bufferSize || 0)
	}
	_bytesWritten = 0

	_write(chunk, encoding, done) {
		if (!done) done = () => {}

		if (this._connecting) {
			this.once('connect', () => this._write(chunk, encoding, done))
			return
		}

		if (this.writable) {
			this._writer.writeBytes(chunk)
			// note: don't pass callback as rference! oh boy those contexts...
			this._writer.storeAsync().done(() => {
				this._bytesWritten += chunk.length
				done()
			}, err => this._onError(err, 'write'))
		} else {
			done(new Error('This socket is closed'))
		}
	}

	_read(n) {}


}
