import {Duplex} from 'stream'
import UwpSocket, {errnoException} from 'uwp-socket'
import {normalizeConnectArgs} from './util'



if (typeof Windows != 'undefined') {
	var StreamSocket = Windows.Networking.Sockets.StreamSocket
}

///////////////////////////////////////////////////////////////////////
/////////////////////////// SOCKET ////////////////////////////////////
///////////////////////////////////////////////////////////////////////




export class Socket extends UwpSocket {

	localAddress = undefined
	localPort = undefined
	remoteAddress = undefined
	remoteFamily = undefined
	remotePort = undefined

	constructor(options) {
		// TODO implement options
		// TODO -- accept socket from server
		super()

		if (!(this instanceof Socket)) return new Socket(options)

		if (options === undefined)
			options = {}

		// Reserve properties
		this.server = this._server = null

		if (options.handle) {
			// wrapping server connection socket
			this._handle = options.handle // private
			this.readable = this.writable = true
			this.server = options.server
			this._server = options._server
			this._onConnect()
		}

		// default to *not* allowing half open sockets
		this.allowHalfOpen = options && options.allowHalfOpen || false

		// if we have a handle, then start the flow of data into the
		// buffer.  if not, then this will happen when we connect
		if (this._handle && options.readable !== false) {
			if (options.pauseOnCreate) {
				// TODO
			} else {
				this.read(0)
			}
		}
	}
	
	address() {
		return {
			address: this.remoteAddress,
			family: this.remoteFamily,
			port: this.remotePort
		}
	}

	connect(options, cb) {
		if (options === null || typeof options !== 'object') {
			// Old API:
			// connect(port, [host], [cb])
			// connect(path, [cb])
			var args = normalizeConnectArgs(arguments)
			return Socket.prototype.connect.apply(this, args)
		}
		
		// TODO, IPv6
		if (options.host == 'localhost')
			options.host = '127.0.0.1'
		
		if (this._connecting || this._connected)
			process.nextTick(() => {
				this.emit('error', errnoException('EISCONN', 'connect', options.host, options.port))
				this.destroy()
			})
			//process.nextTick(connectErrorNT, this, errnoException('EISCONN', 'connect', options.host, options.port))

		if (this.destroyed) {
			this._readableState.reading = false
			this._readableState.ended = false
			this._readableState.endEmitted = false
			this._writableState.ended = false
			this._writableState.ending = false
			this._writableState.finished = false
			this._writableState.errorEmitted = false
			this.destroyed = false
			this._handle = null
			this._sockname = null
		}

		super.connect(cb)

		//this._unrefTimer()

		this._handle = new StreamSocket()
		//this._handle.control.keepAlive = false
		// Microsoft desperately wants to make this more complicated than it needs to be
		var hostName = new Windows.Networking.HostName(options.host)
		// connect and wait for the magic to happen
		this._handle.connectAsync(hostName, options.port)
					.done(this._onConnect, err => this._onError(err, 'connect', options.host, parseInt(options.port)))
		return this
	}

	_onConnect() {
		// .destroy() might have been called in meantime (right after .connect() but before connection was established)
		if (this.destroyed) return
		this.localPort = this._handle.information.localPort
		this.localAddress = this._handle.information.localAddress.canonicalName
		this.remotePort = this._handle.information.remotePort
		this.remoteAddress = this._handle.information.remoteAddress.canonicalName
		this.remoteFamily = this.remoteAddress.includes(':') ? 'IPv6' : 'IPv4'
		super._onConnect()
	}

	destroy(exception) {
		super.destroy(exception)
		if (this._server) {
			this._server._connections--
			if (this._server._emitCloseIfDrained)
				this._server._emitCloseIfDrained()
		}
	}
	



	// No StreamSocket equivalent
	ref() {
		console.warn('ref() not implemented. No WinRT equivalent')
		return this
	}
	unref() {
		console.warn('unref() not implemented. No WinRT equivalent')
		return this
	}


	// TODO
	setTimeout(timeout, callback) {
		console.warn('setTimeout() not implemented')
		return this
	}

	// TODO (following code is probably not working. Copied straight outta node source)
	setNoDelay(enable) {
		console.warn('setNoDelay() not implemented')
		/*if (!this._handle) {
			this.once('connect',
			enable ? this.setNoDelay : () => this.setNoDelay(enable))
			return this
		}

		// backwards compatibility: assume true when `enable` is omitted
		if (this._handle.setNoDelay)
			this._handle.setNoDelay(enable === undefined ? true : !!enable)*/
		return this
	}

	// TODO (following code is probably not working. Copied straight outta node source)
	setKeepAlive(setting, msecs) {
		console.warn('setKeepAlive() not implemented')
		/*if (!this._handle) {
			this.once('connect', () => this.setKeepAlive(setting, msecs))
			return this
		}

		if (this._handle.setKeepAlive)
			this._handle.setKeepAlive(setting, ~~(msecs / 1000))*/
		return this
	}

	_unrefTimer() {}



}

