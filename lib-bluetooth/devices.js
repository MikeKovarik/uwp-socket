import {EventEmitter} from 'events'
var {DeviceWatcherStatus, DeviceInformation} = Windows.Devices.Enumeration


export class UwpDevice {

	// STATIC /////////////////////////////////////////////////////////////////

	static async from(arg) {
		console.log('UwpDevice.from()', arg)
		if (typeof arg === 'string' && arg.includes('#') && arg.includes('-')) {
			// Naive UWP device ID check.
			// IDs usually look like:
			// - Bluetooth#Bluetooth60:02:92:08:84:11-98:d3:33:80:ac:07
			// - \\?\USB#VID_2341&PID_0043#8533931323335151E150#{86e0d1e0-8089-11d0-9ce4-08003e301f73}
			return this.fromId(arg)
		} else {
			throw new Error('Invalid agument', arg)
		}
	}

	static async fromId(id) {
		console.log('UwpDevice.fromId()', id)
		var uwpDeviceInfo = await DeviceInformation.createFromIdAsync(id, null)
		console.log('uwpDeviceInfo', uwpDeviceInfo)
		return new this(uwpDeviceInfo)
	}

	static fromDeviceInfo(uwpDeviceInfo) {
		return new this(uwpDeviceInfo)
	}

	// INSTANCE ///////////////////////////////////////////////////////////////

	constructor(arg) {
		var ctorName = arg.constructor.name
		if (ctorName.endsWith('DeviceInformation')) {
			this.uwpDeviceInfo = arg
		} else if (ctorName.endsWith('Device')) {
			this.uwpDevice = arg
			this.uwpDeviceInfo = arg.deviceInformation
		}
		this.id = this.uwpDeviceInfo.id
	}

	update(deviceInfoUpdate) {
		this.uwpDeviceInfo.update(deviceInfoUpdate)
	}

	get name() {return this.uwpDeviceInfo.name}
	//get displayName() {return uwpDeviceInfo.properties['System.ItemNameDisplay']}

}



export class UwpDeviceEnumerator extends Map {

	static DeviceConstructor = UwpDevice

	constructor(options = {}) {
		// Inherit Map class
		super()
		// Also inherit EventEmitter class
		EventEmitter.call(this)
		Object.assign(this, options)

		this.isReady = false
		this.ready = this.setup().then(() => {
			this.isReady = true
			this.emit('ready')
		})
	}

	setup() {
		this._onAdded = this._onAdded.bind(this)
		this._onUpdated = this._onUpdated.bind(this)
		this._onRemoved = this._onRemoved.bind(this)
		// Createquery for scanner or watcher.
		this.query = this.constructor.getDeviceSelector()
		// Create watcher
		if (this.continuousScanning !== false) {
			var watcher = DeviceInformation.createWatcher(this.query, null)
			this.uwpWatcher = watcher
			watcher.addEventListener('added', this._onAdded)
			watcher.addEventListener('updated', this._onUpdated)
			watcher.addEventListener('removed', this._onRemoved)
			//watcher.addEventListener('stopped', onStopped)
		}
	}

	destroy() {
		var {watcher} = this.uwp
		if (watcher) {
			this.stopWatcher()
			watcher.removeEventListener('added', this._onAdded)
			watcher.removeEventListener('updated', this._onUpdated)
			watcher.removeEventListener('removed', this._onRemoved)
			//watcher.removeEventListener('stopped', onStopped)
		}
	}

	// Scans and keeps continuously watching for additions, updates and removals.
	async scan(query = this.query) {
		this.startWatcher()
		var deviceInfos = await DeviceInformation.findAllAsync(query, null)
		return Array.from(deviceInfos).map(this._onAdded)
	}

	get watcherRunning() {
		if (this.uwpWatcher) {
			var status = this.uwpWatcher.status
			return status === DeviceWatcherStatus.started
		}
	}

	startWatcher() {
		if (this.uwpWatcher && !this.watcherRunning)
			this.uwpWatcher.start()
	}

	stopWatcher() {
		if (this.uwpWatcher && this.watcherRunning)
			this.uwpWatcher.stop()
	}

	// like get() but does not look in map, but queries the os
	async find(...args) {
		var device = await this.constructor.DeviceConstructor.from(...args)
		this._set(device)
		return device
	}

	// WATCHER HANDLERS

	_onAdded(deviceInfo) {
		var device = new this.constructor.DeviceConstructor(deviceInfo)
		this._set(device)
		return device
	}
	_set(device) {
		if (!this.has(device.id))
			this.emit('found', device)
		this.set(device.id, device)
	}

	_onUpdated(updateInfo) {
		var device = this.get(updateInfo.id)
		if (device) {
			device.update(updateInfo)
			this.emit('update', device)
		}
	}

	_onRemoved(updateInfo) {
		var device = this.get(updateInfo.id)
		if (device)
			this.emit('removed', device)
		this.delete(updateInfo.id)
	}

	// TODO
	// TODO: https://docs.microsoft.com/en-us/windows/uwp/devices-sensors/aep-service-class-ids
	static handleOrCreateQuery(query) {
		var type = typeof query
		/*
		if (type === 'string') {
			if valid aqs
				return
			else if some codename like 'bluetooth', 'btle', or uuid (of service, or protocol, or bt version)
				transform to aqs
		} else if (Array.isArray(query)) {
			do checks like in previous branch, but for all items of array
		} else if (type === 'object') {
			if web bluetooth filter object
				transform to aqs
		} else
		*/
		if (type === 'undefined') {
			query = this.getDeviceSelector()
		}
		return query
	}

	// PICKER

	static async openPicker(query, rect, placement) {
		// query
		query = this.handleOrCreateQuery(query)
		// rect
		if (rect && !rect.x && !rect.y && !rect.width && !rect.height) {
			if (rect instanceof ClientRect)
				var bbox = rect
			else if (rect instanceof HTMLElement)
				var bbox = rect.getBoundingClientRect()
			else
				throw new Error('Invalid rect argument')
			rect = {
				x: bbox.left, y: bbox.top,
				width: bbox.width, height: bbox.height
			}
		} else {
			rect = {x: 16, y: 16, width: 0, height: 0}
		}
		// https://docs.microsoft.com/en-us/uwp/api/windows.ui.popups.placement
		if (typeof placement === 'string')
			placement = Windows.UI.Popups.Placement[placement]
		// open
		var picker = new Enumeration.DevicePicker()
		console.log('query', query)
		picker.filter.supportedDeviceSelectors.push(query)
		var deviceInfo = await picker.pickSingleDeviceAsync(rect, placement)
		console.log('deviceInfo', deviceInfo)
		return new this.DeviceConstructor(deviceInfo)
	}

	async openPicker(rect, placement) {
		var device = await this.constructor.openPicker(this.query, rect, placement)
		this._set(device)
		return device
	}

}

// Also inherit from EventEmitter class
for (var method in EventEmitter.prototype)
	UwpDeviceEnumerator.prototype[method] = EventEmitter.prototype[method]
