var errorCodes = {
	'-2147014835': 'ECONNREFUSED',
	'-2147013895': 'ENOENT',
	// (Address already in use): An attempt to bind a server (net, http, or https) to a local address failed due to another server on the local system already occupying that address.
	'-2147014848': 'EADDRINUSE',
	'-2147014836': 'ETIMEDOUT',
	// TODO (Connection refused): No connection could be made because the target machine actively refused it. 
	'?': 'ECONNREFUSED',
	// TODO EINVAL The socket is already connected.
	'?': 'EINVAL',
	// (Connection reset by peer): A connection was forcibly closed by a peer. 
	'-2147014842': 'ECONNRESET'
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
