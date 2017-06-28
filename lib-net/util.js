export function emitErrorNT(self, err) {
	self.emit('error', err)
}
export function connectErrorNT(self, err) {
	self.emit('error', err)
	self.destroy()
}
export function emitListeningNT(self) {
	// ensure handle hasn't closed
	if (self._handle)
		self.emit('listening')
}
export function emitCloseNT(self) {
	self.emit('close')
}


var errorCodes = {
	'-2147014835': 'ECONNREFUSED',
	'-2147013895': 'ENOENT',
	'-2147014848': 'EADDRINUSE', // (Address already in use): An attempt to bind a server (net, http, or https) to a local address failed due to another server on the local system already occupying that address.
	'-2147014836': 'ETIMEDOUT',
	'?': 'ECONNREFUSED', // TODO (Connection refused): No connection could be made because the target machine actively refused it. 
	'-2147014842': 'ECONNRESET' // (Connection reset by peer): A connection was forcibly closed by a peer. 
	//EACCES (Permission denied): An attempt was made to access a file in a way forbidden by its file access permissions.
}

export function errnoException(err, syscall, address, port) {
	var errname;
	var message;
	if (typeof err == 'object') {
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


// Returns an array [options] or [options, cb]
// It is the same as the argument of Socket.prototype.connect().
export function normalizeConnectArgs(args) {
	var options = {};

	if (args[0] !== null && typeof args[0] === 'object') {
		// connect(options, [cb])
		options = args[0];
	} else {
		// connect(port, [host], [cb])
		options.port = args[0];
		if (typeof args[1] === 'string') {
			options.host = args[1];
		} else {
			options.host = 'localhost';
		}
	}

	var cb = args[args.length - 1];
	return typeof cb === 'function' ? [options, cb] : [options];
}
