import UwpSocket from 'UwpSocket'


var Sockets = Windows.Networking.Sockets
var Crypto = Windows.Security.Cryptography

var DeviceInformation = Windows.Devices.Enumeration.DeviceInformation
var SerialCommunication = Windows.Devices.SerialCommunication
var Bluetooth = Windows.Devices.Bluetooth
var Rfcomm = Bluetooth.Rfcomm

export default class BluetoothSocket extends UwpSocket {

	constructor(info) {
		super()
		this.name = info.name
		this.id = info.id
		var macMatch = idstring.match(/-(([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2}))#/)
		this.mac = macMatch ? macMatch[1] : undefined
	}

	connect() {
		super.connect()
		this._connecting = true
		Rfcomm.RfcommDeviceService.fromIdAsync(this.id)
			.then(service => {
				if (!(service.connectionHostName && service.connectionServiceName)) return
				this._handle = new Sockets.StreamSocket()
				this._handle.connectAsync(service.connectionHostName, service.connectionServiceName)
					.then(this._onConnect)
			})
	}

	disconnect() {
		this._connecting = false
		this._connected = false
	}

}
