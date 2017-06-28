(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('buffer'), require('stream')) :
	typeof define === 'function' && define.amd ? define('UwpSocket', ['buffer', 'stream'], factory) :
	(global.UwpSocket = factory(global.buffer,global.stream));
}(this, (function (buffer,stream) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _errorCodes;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var errorCodes = (_errorCodes = {
	'-2147014835': 'ECONNREFUSED',
	'-2147013895': 'ENOENT',
	// (Address already in use): An attempt to bind a server (net, http, or https) to a local address failed due to another server on the local system already occupying that address.
	'-2147014848': 'EADDRINUSE',
	'-2147014836': 'ETIMEDOUT',
	// TODO (Connection refused): No connection could be made because the target machine actively refused it. 
	'?': 'ECONNREFUSED'
}, _defineProperty(_errorCodes, '?', 'EINVAL'), _defineProperty(_errorCodes, '-2147014842', 'ECONNRESET'), _errorCodes);

function errnoException(err, syscall, address, port) {
	var errname;
	var message;
	if ((typeof err === 'undefined' ? 'undefined' : _typeof(err)) == 'object') {
		errname = errorCodes[err.number] || err.number;
		message = syscall + ' ' + errname + ' ' + err.message;
	} else {
		errname = err;
		message = syscall + ' ' + errname;
	}
	var e = new Error(message);
	e.code = e.errno = errname;
	e.syscall = syscall;
	if (port) {
		e.port = port;
	}
	if (address) {
		e.address = address;
	}
	return e;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import {process} from 'process'
var Streams = Windows.Storage.Streams;
var DataWriter = Streams.DataWriter;
var DataReader = Streams.DataReader;

var UwpSocket = function (_Duplex) {
	_inherits(UwpSocket, _Duplex);

	// 64kB
	function UwpSocket() {
		var _ref;

		_classCallCheck(this, UwpSocket);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var _this = _possibleConstructorReturn(this, (_ref = UwpSocket.__proto__ || Object.getPrototypeOf(UwpSocket)).call.apply(_ref, [this].concat(args)));

		_this._connecting = false;
		_this._connected = false;
		_this.destroyed = false;
		_this._hadError = false;
		_this._maxChunkLength = 65536;
		_this._handle = null;
		_this.bytesRead = 0;
		_this._bytesWritten = 0;


		_this._onConnect = _this._onConnect.bind(_this);
		_this._readChunk = _this._readChunk.bind(_this);
		_this._onRead = _this._onRead.bind(_this);

		// shut down the socket when we're finished with it.
		_this.on('finish', _this.destroy);

		_this._initSocketHandle();
		return _this;
	}
	// this is the UWP StreamSocket 


	// exporting as static on class due to limitations of UMD format
	// to which this project compiles (until ESM is widely available)


	_createClass(UwpSocket, [{
		key: '_initSocketHandle',
		value: function _initSocketHandle() {
			this.readable = false;
			this.writable = false;
			this.destroyed = false;
			this.bytesRead = 0;
			this._bytesWritten = 0;
			this._hadError = false;
		}
	}, {
		key: 'connect',
		value: function connect(cb) {
			this._initSocketHandle();

			if (typeof cb === 'function') this.once('connect', cb);

			this._connecting = true;
			this.writable = true;
		}
	}, {
		key: '_onConnect',
		value: function _onConnect() {
			// .destroy() might have been called in meantime (right after .connect() but before connection was established)
			if (this.destroyed) return;
			// setup state
			this._connecting = false;
			this._connected = true;
			// setup writer and writer. it needs to be ready to use in connect callback
			this._writer = new DataWriter(this._handle.outputStream);
			this.writable = true;
			this._reader = new DataReader(this._handle.inputStream);
			this.readable = true;
			// Make _reader.loadAsync read any ammount of bytes (basically right when any data arrive)
			// In other words: wont't wait for receiving all of the _maxChunkLength to call _onRead
			this._reader.inputStreamOptions = Windows.Storage.Streams.InputStreamOptions.partial;
			// emit connect, at this point everything should be ready to write
			this.emit('connect');
			// start listening only after emiting connect, 'data' event can't preceed 'connect'
			this._readChunk();
			// start the first read, or get an immediate EOF.
			// this doesn't actually consume any bytes, because len=0.
			this.read(0);
		}
	}, {
		key: '_readChunk',
		value: function _readChunk() {
			var _this2 = this;

			if (!(this._reader && this.readable)) return;
			// sets up data listener and calls _onRead if (what a surprise) data is received
			this._reader.loadAsync(this._maxChunkLength).done(this._onRead, function (err) {
				return _this2._onError(err, 'read');
			});
		}
	}, {
		key: '_onRead',
		value: function _onRead(chunkBytesRead) {
			if (chunkBytesRead == 0) {
				// server closed this socket, destroy this end too
				this.end();
				return;
			}
			this.bytesRead += chunkBytesRead;
			// received some data, load the into Node-like Buffer (Uint8 typed array) and emit
			var buffer$$1 = new buffer.Buffer(chunkBytesRead);
			// read data from DataReder into given buffer array
			this._reader.readBytes(buffer$$1);
			this.push(buffer$$1);
			// TODO: apply backpressure (pause receiving data) if push returns false
			// keep receiving next data
			setImmediate(this._readChunk);
		}
	}, {
		key: '_onError',
		value: function _onError(err, syscall, address, port) {
			var _this3 = this;

			// TODO investigate - should multiple errors be merged into one?
			// probable case - .end() during both reading and writing will (maybe) cause two errors? just a thought thou...

			// probably just some error of not finished read/write due to calling cancelIOAsync in .end()
			if (this.destroyed) return;
			this._connecting = false;
			this._hadError = true;
			//process.nextTick(connectErrorNT, this, errnoException(err, syscall, address, port))
			//process.nextTick(() => {
			setImmediate(function () {
				_this3.emit('error', errnoException(err, syscall, address, port));
				_this3.destroy();
			});
		}

		//////////////////////////////// END & DESTROY ////////////////////////////////////////

	}, {
		key: 'end',
		value: function end(data, encoding) {
			var _this4 = this;

			if (!this._connecting && !this._connected) {
				// .end() was called before .connect() do nothing
				// Duplex.prototype.write has to be called to ensure throwing error (write after end)
				stream.Duplex.prototype.end.call(this, data, encoding);
				return;
			}
			if (this._connecting) {
				this.once('connect', function () {
					return _this4.end(data, encoding);
				});
				//setImmediate(() => this.end(data, encoding))
				return;
			}
			// Duplex.prototype.write has to be called to ensure throwing error (write after end)
			// WARNING: Duplex.end() calls this.destroy
			stream.Duplex.prototype.end.call(this, data, encoding);
			this._willEmitEnd = true;
			if (this.readable && !this._readableState.endEmitted) {
				this.read(0);
			}
		}
	}, {
		key: 'destroy',
		value: function destroy(exception, cb) {
			var _this5 = this;

			// .destroy() called before .connect() do nothing
			if (!this._connecting && !this._connected) return;

			var fireErrorCallbacks = function fireErrorCallbacks() {
				if (cb) cb(exception);
				if (exception && !_this5._writableState.errorEmitted) {
					//process.nextTick(emitErrorNT, this, new Error(exception))
					setImmediate(function () {
						return _this5.emit('error', new Error(exception));
					});
					//setImmediate(() => this.emit('error', new Error(exception)))
					_this5._writableState.errorEmitted = true;
				}
			};

			// already destroyed, fire error callbacks
			if (this.destroyed) return fireErrorCallbacks();

			// stream is no more readable (won't be sending anything to server)
			// but it remains readable since some data from server might be already
			// on the way or in buffer waiting to be emitted
			this.writable = false;
			// calling destroy with argument causes error and 'close' event callback argument to be true
			this._hadError = this._hadError || !!exception;
			// we set destroyed to true before firing error callbacks in order
			// to make its re-entrance safe in case Socket.prototype.destroy()
			// is called within callbacks
			this.destroyed = true;
			fireErrorCallbacks();
			this._connecting = false;
			this._connected = false;

			this._destroyHandle();
		}
	}, {
		key: '_destroyHandle',
		value: function _destroyHandle() {
			var _this6 = this;

			// why the setImmediate?
			// cancelIOAsync might call the callback synchronously if there's no pending read/write
			// but it needs to be async - to properly react to errors (Error: write after end).
			// Also .end() (unlike .destroy() ) gives reader/writer some head start to finish reading.
			// Writer has to stop sending whatever is in buffer and send FIN packet to gracefuly close connection. 
			setImmediate(function () {
				if (_this6._handle == null) return;
				// disabling readable here instead of in _destroyHandle2() to make reading safer
				// (to prevent Error reading in inappropriate time)
				_this6.readable = false;
				// CancelIOAsync cancels pending writes and reads, but if there is a write buffer pending
				// in networking drivers, it flushes the write.
				var _destroyHandle2 = _this6._destroyHandle2.bind(_this6);
				_this6._handle.cancelIOAsync().done(_destroyHandle2, _destroyHandle2);
				// TODO investigate - does this need any futher error handling?
			});
		}
	}, {
		key: '_destroyHandle2',
		value: function _destroyHandle2() {
			var _this7 = this;

			if (this._handle) {
				try {
					this._handle.close();
				} catch (e) {}
				this._handle = null;
			}
			if (this._writer) {
				// might be writing at the moment
				try {
					this._writer.detachStream();
				} catch (e) {}
				// TODO invesitagate - does this need any further error handling? Or will the writer just burn in flames on it's own?
				this._writer = null;
			}
			if (this._reader) {
				// might be reading at the moment
				try {
					this._reader.detachStream();
				} catch (e) {}
				// TODO invesitagate - does this need any further error handling? Or will the reader just burn in flames on it's own?
				this._reader = null;
			}

			if (this._willEmitEnd && !this._readableState.endEmitted) {
				// either we closed the socket or server disconnected us and WinRT didn't give us EOF
				// so we have to simulate it by pushing null to data. (in other word: this emits 'end')
				this.push(null);
				this.once('end', function () {
					return _this7.emit('close', _this7._hadError);
				});
			} else {
				this.emit('close', this._hadError);
			}
		}

		//////////////////////////////// READ / WRITE ////////////////////////////////////////

	}, {
		key: '_write',
		value: function _write(chunk, encoding, done) {
			var _this8 = this;

			if (!done) done = function done() {};

			if (this._connecting) {
				this.once('connect', function () {
					return _this8._write(chunk, encoding, done);
				});
				return;
			}

			if (this.writable) {
				this._writer.writeBytes(chunk);
				// note: don't pass callback as rference! oh boy those contexts...
				this._writer.storeAsync().done(function () {
					_this8._bytesWritten += chunk.length;
					done();
				}, function (err) {
					return _this8._onError(err, 'write');
				});
			} else {
				done(new Error('This socket is closed'));
			}
		}
	}, {
		key: '_read',
		value: function _read(n) {}
	}, {
		key: 'bufferSize',
		get: function get() {
			// returns undefined before socket.connect()
			if (this._connecting || this._connected) return this._writableState.length;
		}

		// The amount of received bytes.

	}, {
		key: 'bytesWritten',


		// The ammount of bytes sent
		get: function get() {
			return this._bytesWritten + (this.bufferSize || 0);
		}
	}]);

	return UwpSocket;
}(stream.Duplex);

UwpSocket.errnoException = errnoException;

return UwpSocket;

})));

//# sourceMappingURL=UwpSocket.js.map
