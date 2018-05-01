import {EventEmitter} from 'events'
import {errnoException, emitErrorNT, emitListeningNT, emitCloseNT} from './util'
import {Socket} from './Socket'


// JSPM will execute this module even when in not WinRT enviroment
// which causes troubles with flexus-net module running in Chrome Apps.
// Wrapped for interacting with WinRT APIs onlny in WinRT.
if (typeof Windows != 'undefined') {
	var {StreamSocketListener, StreamSocket} = Windows.Networking.Sockets
}




export class Server extends EventEmitter {

	_host = null

	constructor(options, connectionListener) {
		super()

		if (!(this instanceof Server)) return new Server(options, connectionListener)

		this._onListen = this._onListen.bind(this)
		this._onConnection = this._onConnection.bind(this)

		EventEmitter.call(this)

		if (typeof options === 'function') {
			connectionListener = options
			options = {}
			this.on('connection', connectionListener)
		} else {
			options = options || {}

			if (typeof connectionListener === 'function') {
				this.on('connection', connectionListener)
			}
		}

		// TODO find local IP
		this._host = '::'
		
		this._connections = 0

		this._handle = null
		//this._unref = false

		this.allowHalfOpen = options.allowHalfOpen || false
		this.pauseOnConnect = !!options.pauseOnConnect
	}

	address() {
		return {
			port: this._port,
			address: this._host,
			family: this._host.indexOf(':') !== -1 ? 'IPv6' : 'IPv4',
		}
	}

	listen(...args) {
		this.listenAsync(...args)
		return this
	}
	async listenAsync(...args) {
		// last argument can be callback function.
		var cb = args.pop()
		if (typeof cb === 'function')
			this.once('listening', cb)
		else
			args.push(cb)
		// nodejs allows (accidentally?) calling .listen() multiple times and simply ignores it
		if (this._handle) return false
		// WinRT needs port (or rather serviceName) to be string, but first, store it as number
		if (typeof args[0] === 'number') {
			this._port = port
			args[0] = args[0].toString()
		}
		this._handle = new StreamSocketListener()
		this._handle.addEventListener('connectionreceived', this._onConnection)
		try {
			await this._handle.bindServiceNameAsync(...args)
			this._onListen()
		} catch(err) {
			this._onError(err, 'listen', this._host, this._port)
		}
	}

	get listening() {
		return !!this._handle
	}

	_onListen() {
		process.nextTick(emitListeningNT, this)
	}

	_onConnection(e) {
		if (this.maxConnections && this._connections >= this.maxConnections) {
			e.socket.close()
			return
		}

		var socket = new Socket({
			server: this,
			_server: this,
			handle: e.socket,
			allowHalfOpen: this.allowHalfOpen,
			pauseOnCreate: this.pauseOnConnect
		})

		this._connections++
		this.emit('connection', socket)
	}

	_connections = 0
	getConnections(cb) {
		process.nextTick(cb, null, this._connections)
	}


	_onError(err, syscall, address, port) {
		// Clean up a listener if we failed to bind to a port.
		this._destroyHandle()
		// When we close a socket, outstanding async operations will be canceled and the
		// error callbacks called.  There's no point in displaying those errors.
		if (this.destroyed) return
		//this.emit('error', errnoException(err, syscall, address, port))
		process.nextTick(emitErrorNT, this, errnoException(err, syscall, address, port))
	}

	_destroyHandle() {
		if (this._handle) {
			// keep handle stored locally for referrence to it's close() when called from cancelIOAsync()
			var handle = this._handle
			this._handle.cancelIOAsync().done(() => handle.close(), () => handle.close())
			this._handle = null
		}
	}

	// No StreamSocketListener equivalent
	ref() {}
	unref() {}

	// Stops the server from accepting new connections and keeps existing connections.
	// The server is finally closed when all connections are ended and the server emits a 'close' event.
	// The optional callback will be called once the 'close' event occurs. Unlike that event, it will be called with an Error as its only argument if the server was not open when it was closed.
	close(cb) {
		if (typeof cb === 'function') {
			if (!this._handle) {
				this.once('close', function() {
					cb(new Error('Not running'))
				})
			} else {
				this.once('close', cb)
			}
		}

		this._destroyHandle()
		
		this._emitCloseIfDrained()

		return this
	}

	_emitCloseIfDrained() {
		if (this._handle || this._connections) return
		process.nextTick(emitCloseNT, this)
	}


}



