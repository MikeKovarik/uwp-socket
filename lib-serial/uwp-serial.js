import UwpSocket from 'uwp-socket'


// TODO: add permission check for <DeviceCapability Name="serialcommunication"> and throw warning
// because it's a common head scratching point
// SerialDevice.fromIdAsync returns null if the permission is not set.

var DeviceInformation = Windows.Devices.Enumeration.DeviceInformation
var SerialCommunication = Windows.Devices.SerialCommunication

export default class SerialSocket extends UwpSocket {

	constructor(info) {
		super()
		this.name = info.name
		this.id = info.id
	}

	connect(baudRate = 9600) {
		super.connect()
		this._connecting = true
		SerialCommunication.SerialDevice.fromIdAsync(this.id)
			.then(serialDevice => {
				if (!serialDevice) {
					this._onError('Unable to connect')
					return
				}
				console.log('serialDevice', serialDevice)
				this.baud = baudRate
				this.port = serialDevice.portName
				//serialDevice.isRequestToSendEnabled = true
				serialDevice.baudRate = baudRate
				serialDevice.stopBits = SerialCommunication.SerialStopBitCount.one
				serialDevice.dataBits = 8
				serialDevice.parity = SerialCommunication.SerialParity.none
				serialDevice.handshake = SerialCommunication.SerialHandshake.none
				this._handle = serialDevice
				this._onConnect()
			})
			.catch(err => {
				this._onError(`
					asyncOpType: ${err.asyncOpType}
					message: ${err.message}
				`)
			})
	}

	disconnect() {
		this._connecting = false
		this._connected = false
	}

}

