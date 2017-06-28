import {EventEmitter} from 'events'
import SerialSocket from './SerialSocket.js'
import BluetoothSocket from './BluetoothSocket.js'



var DeviceInformation = Windows.Devices.Enumeration.DeviceInformation
var SerialCommunication = Windows.Devices.SerialCommunication
var Bluetooth = Windows.Devices.Bluetooth
var Rfcomm = Bluetooth.Rfcomm


export class Devices extends EventEmitter {

	bluetooth = new Map
	serial = new Map

	map = new Map

	constructor() {
		super()
		this.scan = this.scan.bind(this)
		var btPortId = Rfcomm.RfcommServiceId.serialPort
		//this.bluetoothSelector = Rfcomm.RfcommDeviceService.getDeviceSelector(btPortId)
		this.serialSelector = SerialCommunication.SerialDevice.getDeviceSelector()
		this._setupWatcher()
		this.scan()
	}

	_setupWatcher() {
		var watcher = DeviceInformation.createWatcher()
		// Note: WinRT is really really strange!
		//       'added'/'removed' events never get called,
		//       but 'updated' would never get fired unless they are set
		var watcherTimeout
		watcher.addEventListener('added', data => {})
		watcher.addEventListener('removed', data => {})
		watcher.addEventListener('updated', data => {
			console.log('updated', data.id, data)
			clearTimeout(watcherTimeout)
			watcherTimeout = setTimeout(this.scan, 150)
		})
		watcher.start()
	}

	scan() {
		DeviceInformation
			.findAllAsync(this.bluetoothSelector, null)
			.then(array => {
				array.forEach(info => {
					var device = this.bluetooth.get(info.id)
					if (device) {

					} else {
						var device = new BluetoothSocket(info)
						emit('device', device)
						emit('bluetooth-device', device)
						this.bluetooth.set(info.id, device)
						this.map.set(info.id, device)
					}
				})
			})
		console.log('scanning serial')
		DeviceInformation
			.findAllAsync(this.serialSelector, null)
			.then(array => {
				array.forEach(info => {
					var device = this.serial.get(info.id)
					if (device) {

					} else {
						var device = new SerialSocket(info)
						this.emit('device', device)
						this.emit('serial-device', device)
						this.serial.set(info.id, device)
						this.map.set(info.id, device)
					}
				})
			})
		
		/*;([1,2,3,4,5,6,7,8,9]).forEach(i => {
			DeviceInformation.findAllAsync(SerialCommunication.SerialDevice.getDeviceSelector('COM' + i), null)
				.then(res => console.log('COM' + i, res))
		})*/
	}

}


export default new Devices
