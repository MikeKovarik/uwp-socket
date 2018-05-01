import {sdp, gatt} from 'uwp-bluetooth-spec'

var {BluetoothDevice, BluetoothLEDevice} = Windows.Devices.Bluetooth
var {DeviceInformationKind} = Windows.Devices.Enumeration
var {DataReader, DataWriter} = Windows.Storage.Streams


export function macToUlong(string) {
	return parseInt(string.replace(/[^0-9A-Fa-f]/g, ''), 16)
}

export function ulongToMac(ulong) {
	return ulong.toString(16).match(/.{2}/g).join(':')
}

export function wrapUwpPromise(uwpPromise) {
	return new Promise((resolve, reject) => uwpPromise.done(resolve, reject))
}

export function ibufferToBuffer(ibuffer) {
	var reader = DataReader.fromBuffer(ibuffer)
	var buffer = Buffer.alloc(ibuffer.length)
	reader.readBytes(buffer)
	return buffer
}

export function bufferToIbuffer(buffer) {
	var writer = new DataWriter()
	writer.writeBytes(buffer)
	return writer.detachBuffer()
}

export const BASE_UUID = '00000000-0000-1000-8000-00805f9b34fb'
export const BASE_UUID_END = '-0000-1000-8000-00805f9b34fb'

export function uuidToId(uuid) {
	return parseInt(uuid.slice(4,8), 16)
}

export function ensureUuidFormat(arg) {
	if (typeof arg === 'number')
		arg = arg.toString(16)
	if (arg.length === 36)
		return arg
	return (arg.padStart(8, '0') + BASE_UUID_END).toLowerCase()
}

export var BluetoothUUID

if (self.BluetoothUUID === undefined) {

	BluetoothUUID = class BluetoothUUID {

		static getCharacteristic(nameOrCode) {
			this._process(nameOrCode, 'characteristic')
		}

		static getService(nameOrCode) {
			this._process(nameOrCode, 'service')
		}

		static getDescriptor(nameOrCode) {
			// todo
		}

		static canonicalUUID(code) {
			if (Number.isNaN(+code))
				throw new Error(`Failed to execute 'canonicalUUID' on 'BluetoothUUID': Value is not of type 'unsigned long'.`)
			return code.toString(16).padStart(8, '0') + BASE_UUID_END
		}

		static _process(nameOrCode, type) {
			var type = typeof nameOrCode
			if (type === 'number') {
				return this.canonicalUUID(nameOrCode)
			} else if (type === 'string') {
				if (nameOrCode.length === 36 && nameOrCode.endsWith(BASE_UUID_END)) {
					return nameOrCode
				} else {
					var tag = nameOrCode
					var info = Object.values(gatt).find(obj => obj.tag === tag && obj.type === type)
					return this.canonicalUUID(info.code)
				}
			}
		}

	}
} else {
	BluetoothUUID = self.BluetoothUUID
}