import {Duplex} from 'stream'
import UwpSocket from 'uwp-socket'
import {Server} from 'uwp-net'
import {wrapUwpPromise, ibufferToBuffer, uuidToId, BluetoothUUID} from './util.js'
import {bufferToIbuffer} from './util.js'
import {macToUlong, ulongToMac, ensureUuidFormat} from './util.js'
import {UwpDevice, UwpDeviceEnumerator} from './devices.js'
import {sdp, gatt} from 'uwp-bluetooth-spec'

export * from 'uwp-bluetooth-spec'

// TODO: figure out how to .connect() to GATT
// TODO: rename & figure out what to do with .connect() methods
// TODO: make UwpBluetooth inherit Server / .createServer()
// TODO: make BluetoothDevice inherit Client
// TODO: route SPP to BluetoothDevice Client

if (typeof Windows !== 'undefined') {
	var {Enumeration, Bluetooth} = Windows.Devices
	var {DeviceWatcherStatus, DeviceInformation} = Enumeration
	var {DevicePairingResultStatus, DeviceUnpairingResultStatus} = Enumeration
	var {Rfcomm, GenericAttributeProfile, BluetoothError, BluetoothAdapter} = Bluetooth
	var {RfcommDeviceService, RfcommServiceProvider, RfcommServiceId} = Rfcomm
	var {GattServiceProvider, GattCharacteristicProperties, GattCommunicationStatus} = GenericAttributeProfile
	var {GattProtectionLevel, GattClientCharacteristicConfigurationDescriptorValue} = GenericAttributeProfile
	var {GattWriteOption, GattServiceProviderAdvertisingParameters} = GenericAttributeProfile
	var {BluetoothLEAdvertisementWatcher} = Windows.Devices.Bluetooth.Advertisement
	var {DataReader, DataWriter} = Windows.Storage.Streams
	var {RadioState} = Windows.Devices.Radios
	var {StreamSocket, SocketProtectionLevel} = Windows.Networking.Sockets
	var APP_NAME = Windows.ApplicationModel.Package.current.displayName
} else {
	var APP_NAME = document.title
}

// Arbitrary Windows 10 UUIDs used by the system to identify device type.
// https://docs.microsoft.com/en-us/windows/uwp/devices-sensors/aep-service-class-ids
const BLUETOOTH_RFCOMM_UUID = 'e0cbf06c-cd8b-4647-bb8a-263b43f0f974'
const BLUETOOTH_LE_UUID     = 'bb7bb05e-5972-42b5-94fc-76eaa7084d49'
const TRUE  = `System.StructuredQueryType.Boolean#True`
const FALSE = `System.StructuredQueryType.Boolean#False`

const CR   = '\r' // 13
const LF   = '\n' // 10
const CRLF = '\r\n'

const BTC_SERIAL_PORT = '1101'
const SDP_NAME = '0100'
const noop = () => {}

function gattNameToUuid(name) {
	var item = Object.values(gatt).find(obj => obj.tag === name)
	return item && item.uuid
}

function getErrorName(code, enumeration = BluetoothError) {
	return Object.entries(enumeration).find(a => a[1] === error).shift()
}

function iterableToObject(iterable) {
	var object = {}
	if (iterable.size === 0)
		return object
	var iterator = iterable.first()
	while (iterator.hasCurrent) {
		object[iterator.current.key] = iterator.current.value
		iterator.moveNext()
	}
	return object
}

// TODO: add permission check for <DeviceCapability Name="bluetooth" /> and throw warning
// because it's a common head scratching point
// BluetoothDevice.fromIdAsync returns null if the permission is not set.

// NOTE: Device watcher and .findAllAsync() can be used without 'bluetooth' permission/capability in appxmanifest.
//       Getting more info with BluetoothDevice.fromIdAsync() requirres it or it throws.

// RfcommDeviceService.getDeviceSelector(RfcommServiceId.serialPort)
// BluetoothDevice.getDeviceSelector()
// BluetoothLEDevice.getDeviceSelector()

export class BluetoothSocket extends UwpSocket {

	constructor(deviceInfo) {
		super()
		this.name = deviceInfo.name
		this.id = deviceInfo.id
		var macMatch = this.id.match(/-(([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2}))#/)
		this.mac = macMatch ? macMatch[1] : undefined
	}

	async connect() {
		super.connect()
		this._connecting = true
		console.log('this.id', this.id)
		var device = await Bluetooth.BluetoothDevice.fromIdAsync(this.id)
		//var service = await RfcommDeviceService.fromIdAsync(this.id)
		//var service = await GattDeviceService.fromIdAsync(this.id)
		console.log('device', device)
		var services = await device.getRfcommServicesAsync()
		console.log('services', services)
		// toDO FILTER
		var service = services.services[0]
		console.log('service', service)
		console.log('service.connectionHostName', service.connectionHostName)
		//console.log('service.connectionServiceName', service.connectionServiceName)
		if (!(service.connectionHostName && service.connectionServiceName))
			throw new Error('connectionHostName and connectionServiceName is not defined')
		this._handle = new StreamSocket()
		await this._handle.connectAsync(service.connectionHostName, service.connectionServiceName)
		this._onConnect()
	}

	disconnect() {
		this._connecting = false
		this._connected = false
	}

}





// TODO: add .ready promise and autoconnect?
export class UwpBluetoothDevice extends UwpDevice {

	// STATIC /////////////////////////////////////////////////////////////////

	// TODO
	// argument can be either fully realized UWP ID, string MAC address, ulong MAC, or instances of UWP DeviceInfo, Device classes.
	// - Bluetooth#Bluetooth60:02:92:08:84:11-98:d3:33:80:ac:07
	// - 98:d3:33:80:ac:07
	static from(arg, prioritizeLowEnergy) {
		// TODO. add class recognition so deviceInfo, device, bluetoothadapter and other classes can be passed in.
		if (typeof arg === 'string' && arg.length === 17) {
			// Mac address in form of string. has to be converted down to ulong number.
			return this.fromAddress(macToUlong(arg), prioritizeLowEnergy)
		} else if (typeof arg === 'number') {
			// Mac address in form of ulong number. UWP shows this property in device class like uwpDevice.bluetoothAddress.
			return this.fromAddress(arg, prioritizeLowEnergy)
		}
		return super.from(arg)
	}

	static async fromId(id) {
		if (id.includes('BluetoothLE'))
			var uwpDevice = await BluetoothLEDevice.fromIdAsync(id, null)
		else
			var uwpDevice = await BluetoothDevice.fromIdAsync(id, null)
		return new this(uwpDevice)
	}

	static async fromAddress(ulongMac, prioritizeLowEnergy = true) {
		if (prioritizeLowEnergy)
			var ctors = [BluetoothLEDevice, BluetoothDevice]
		else
			var ctors = [BluetoothDevice, BluetoothLEDevice]
		var uwpDevice = await ctors[0].fromBluetoothAddressAsync(ulongMac)
		if (uwpDevice === null)
			uwpDevice = await ctors[1].fromBluetoothAddressAsync(ulongMac)
		if (uwpDevice)
			return new this(uwpDevice)
	}

	// INSTANCE ///////////////////////////////////////////////////////////////

	services = []

	constructor(uwpDeviceInfo) {
		super(uwpDeviceInfo)
		this.mac = this.id.slice(-17)
		this.isLowEnergy = this.id.includes('BluetoothLE')
		this.isClassic = !this.isLowEnergy
	}

	// WEB-BLUETOOTH-LIKE METHODS AND SHIM ////////////////////////////////////

	get gatt() {
		// This is just a shim to make this class work with Web Bluetooth API.
		// Web Bluetooth hides device's services and other methods behind gatt.connect().
		// example: const server = await device.gatt.connect()
		return this
	}

	async connect() {
		if (this.isLowEnergy) {
			this.uwpDevice = await BluetoothLEDevice.fromIdAsync(this.id)
			var result = await this.uwpDevice.getGattServicesAsync()
		} else {
			this.uwpDevice = await BluetoothDevice.fromIdAsync(this.id)
			var result = await this.uwpDevice.getRfcommServicesAsync()
		}
		this.services = result.services.map(uwpService => new BluetoothService(uwpService))
		// Wait for app services to be ready
		await Promise.all(this.services.map(service => service.ready))
		//socket.connectAsync(service.connectionHostName, service.connectionServiceName)
		// Return self to mimic Web Bluetooth API (its connect function returns different class' instance though)
		return this
	}

	// example: getPrimaryService('generic_access')
	// see https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics-async-await.html
	getPrimaryService(name) {
		var uuid = gattNameToUuid(name)
		return this.services.find(service => service.uuid === uuid)
	}
	// https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTServer/getPrimaryServices
	// https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics-async-await.html
	getPrimaryServices() {
		// TODO: return only LE GATT services!
		return this.services
	}

	// ADDITIIONAL UWP-ONLY METHODS ///////////////////////////////////////////

	get canPair() {
		if (this.uwpDeviceInfo.pairing)
			return this.uwpDeviceInfo.pairing.canPair
	}
	get isPaired() {
		if (this.uwpDeviceInfo.pairing)
			return this.uwpDeviceInfo.pairing.isPaired
	}

	async pair() {
		if (!this.canPair)
			throw new Error('The device cannot be paired')
		if (this.isPaired)
			throw new Error('The device is already paired')
		var {status} = await this.uwpDeviceInfo.pairing.pairAsync()
		if (status !== DevicePairingResultStatus.paired)
			throw new Error(`Could not read value. ${getErrorName(status, DevicePairingResultStatus)}`)
	}

	async unpair() {
		if (!this.isPaired)
			throw new Error('The device is already unpaired')
		var {status} = await this.uwpDeviceInfo.pairing.unpairAsync()
		if (status !== DeviceUnpairingResultStatus.unpaired)
			throw new Error(`Could not read value. ${getErrorName(status, DeviceUnpairingResultStatus)}`)
	}

	openSocket() {
		return new BluetoothSocket(this.uwpDeviceInfo)
	}

	//get serialPort() {
	//	return this.serviceIds.includes(BTC_SERIAL_PORT)
	//}

}










class BluetoothService {

	constructor(uwpService, options) {
		this.uwpService = uwpService
		this.isGatt = !uwpService.serviceId
		var promises = []
		if (this.isGatt) {
			this.uuid = uwpService.uuid
			this.name = (gatt[this.uuid] || {}).name
			promises.push(this.getCharacteristics())
		} else {
			this.uuid = uwpService.serviceId.uuid
			this.name = (sdp[this.uuid] || {}).name
			let promise = this.ready = this.getAttribute(SDP_NAME)
				.then(attribute => this.userDescription = attribute.value.slice(2).toString())
				.catch(noop)
			promises.push(this.getAttributes(), promise)
		}
		this.id = uuidToId(this.uuid)
		this.connectionHostName = uwpService.connectionHostName
		this.connectionServiceName = uwpService.connectionServiceName
		//socket.connectAsync(service.connectionHostName, service.connectionServiceName)
		this.ready = Promise.all(promises)
	}

	// Web Bluetooth API
	async getCharacteristic(name) {
		var uuid = gattNameToUuid(name)
		var characteristics = this.characteristics || await this.getCharacteristics()
		return characteristics.find(service => service.uuid === uuid)
	}

	// Web Bluetooth API
	// Retrieves and caches GATT Services wrapped in BluetoothCharacteristic class
	async getCharacteristics() {
		if (this.characteristics)
			return this.characteristics
		var {status, characteristics} = await this.uwpService.getCharacteristicsAsync()
		// TODO: handle status. this returns 'status' instead of 'error' so it probably uses something else than BluetoothError.
		//if (status !== BluetoothError.success)
		//	throw new Error(`Could not get GATT characteristics. ${getErrorName(status)}`)
		this.characteristics = Array.from(characteristics)
			.map(uwpCharacteristic => new BluetoothCharacteristic(uwpCharacteristic))
		return this.characteristics
	}

	// Non standad but follows similar style of Web Bluetooth API
	async getAttribute(code) {
		if (typeof code === 'string')
			code = parseInt(code, 16)
		var uuid = BluetoothUUID.canonicalUUID(code)
		var attributes = this.attributes || await this.getAttributes()
		return attributes.find(attribute => attribute.uuid === uuid)
	}

	// Non standad but follows similar style of Web Bluetooth API
	async getAttributes() {
		if (this.attributes)
			return this.attributes
		var iterable = await this.uwpService.getSdpRawAttributesAsync()
		// TODO: rewrite using iterableToObject(iterable)
		if (iterable.size === 0) return []
		this.attributes = []
		let iterator = iterable.first()
		while (iterator.hasCurrent) {
			let uwpAttribute = iterator.current
			let id = uwpAttribute.key
			let uuid = BluetoothUUID.canonicalUUID(id)
			var value = ibufferToBuffer(uwpAttribute.value)
			this.attributes.push({id, uuid, value})
			iterator.moveNext()
		}
		return this.attributes
		//return this.attributes = Object.entries(iterableToObject(iterable))
		//	.map(([key, val]) => {
		//		var id = parseInt(key, 16)
		//		var uuid = BluetoothUUID.canonicalUUID(id)
		//		var value = ibufferToBuffer(uwpAttribute.value)
		//		return {id, uuid, value}
		//	})
	}

	// WARNING:
	// UWP weirdly reverses order of (pairs in) given UUIDs.
	// For example this: '01234567-89AB-CDEF-0123-456789ABCDEF'
	// is turned into:   'EFCDAB89-6745-2301-EFCD-AB8967452301' 
	static async createRfcomm(uuid, name, attributes = {}) {
		if (name === undefined)
			name = `${APP_NAME} custom service`
		uuid = ensureUuidFormat(uuid)
		var serviceId = RfcommServiceId.fromUuid(uuid)
		var serviceProvider = await RfcommServiceProvider.createAsync(serviceId)
		// Create Service Name SDP attribute.
		attributes[SDP_NAME] = Buffer.from([
			// The SDP Type of the Service Name SDP attribute.
			// The first byte in the SDP Attribute encodes the SDP Attribute Type as follows :
			//    -  the Attribute Type size in the least significant 3 bits,
			//    -  the SDP Attribute Type value in the most significant 5 bits.
			(4 << 3) | 5,
			// The length of the UTF-8 encoded Service Name SDP Attribute.
			name.length,
			// The UTF-8 encoded Service Name value.
			...Buffer.from(name)
		])
		// Create SDP attributes from the attributes object.
		for (var [id, buffer] of Object.entries(attributes))
			serviceProvider.sdpRawAttributes.insert(parseInt(id, 16), bufferToIbuffer(buffer))
		return serviceProvider
	}

	// TODO
	static async createGatt(uuid, characteristics = {}) {
		uuid = ensureUuidFormat(uuid)
		console.log('uuid', uuid)
		var {error, serviceProvider} = await GattServiceProvider.createAsync(uuid)
		if (error !== BluetoothError.success)
			throw new Error(`Could not create GATT service ${uuid}. ${getErrorName(error)}`)
		if (Object.keys(characteristics).length === 0) {
			let id = parseInt(uuid.slice(4, 8), 16)
			let charUuid = ensureUuidFormat((id + 1).toString(16))
			characteristics[charUuid] = {
				// TODO: also add the no-response thing.
				read: true,
				write: true,
				notify: true,
				// TODO: reconscider this API, most likely break this down into various properties.
				protection: 'plain',
			}
		}
		var createCharacteristic = async (options, id) => {
			var charUuid = ensureUuidFormat(options.uuid || options.id || id)
			var params = new GenericAttributeProfile.GattLocalCharacteristicParameters()
			params.characteristicProperties = 0
			if (options.read)   params.characteristicProperties |= GattCharacteristicProperties.read
			if (options.write)  params.characteristicProperties |= GattCharacteristicProperties.write
			if (options.notify) params.characteristicProperties |= GattCharacteristicProperties.notify
			if (options.value)  params.staticValue = ibufferToBuffer(Buffer.from(options.value))
			params.userDescription = options.name
			params.writeProtectionLevel = GattProtectionLevel[options.protection]
			var {error, characteristic} = await serviceProvider.service.createCharacteristicAsync(charUuid, params)
			if (error !== BluetoothError.success)
				throw new Error(`Could not create GATT characteristic ${charUuid}. ${getErrorName(error)}`)
			//characteristic.addEventListener('readrequested', e => {}) // TODO
		}
		// Accepts both objects and arrays.
		if (Array.isArray(characteristics)) {
			var promises = characteristics.map(createCharacteristic)
		} else {
			var promises = []
			for (var [id, options] of Object.entries(characteristics))
				promises.push(createCharacteristic(options, id))
		}
		await Promise.all(promises)
		return serviceProvider
	}


}








class BluetoothCharacteristic {

	constructor(uwpCharacteristic) {
		this.uwpCharacteristic = uwpCharacteristic
		this.uuid = uwpCharacteristic.uuid
		this.id = uuidToId(this.uuid)
		this.name = (gatt[this.uuid] || {}).name
		this.userDescription = uwpCharacteristic.userDescription // rename?
		var {characteristicProperties} = uwpCharacteristic
		this.canRead   = characteristicProperties & GattCharacteristicProperties.read
		this.canWrite  = characteristicProperties & GattCharacteristicProperties.write
		this.canNotify = characteristicProperties & GattCharacteristicProperties.notify
		this.characteristicProperties = characteristicProperties
		this.protectionLevel = uwpCharacteristic.protectionLevel
		this.attributeHandle = uwpCharacteristic.attributeHandle
		this._onValueChanged = this._onValueChanged.bind(this)
		// Creating stream object and hooking it into read (from notifications) & write
		this.socket = new Duplex
		this.socket._read = () => {}
		this.socket._write = (chunk, encoding, cb) => this.writeValue(chunk).then(cb)
		// TODO
		var isClient = true // TODO
		if (isClient) {
			this.startNotifications()
		} else {
			//uwpCharacteristic.addEventListener('readrequested', e => {})
			//uwpCharacteristic.addEventListener('writerequested', e => {})
		}
	}

	_onValueChanged(e) {
		var buffer = ibufferToBuffer(e.characteristicValue)
		this.socket.push(buffer)
		// TODO: also make the event available through Web Bluetooth API
	}

	// TODO
	_onReadRequested(request) {
		// TODO: this is just copy-pasted from docs. needs to be further developed but i currently
		// can't becuse my laptop (o maybe just all Windows desktops) can't work as peripheral.
		/*
		var writer = new DataWriter()
		var request = await args.getRequestAsync()
		request.respondWithValue(writer.detachBuffer())
		*/
	}

	// TODO
	_onWriteRequested(request) {
		// TODO: this is just copy-pasted from docs. needs to be further developed but i currently
		// can't becuse my laptop (o maybe just all Windows desktops) can't work as peripheral.
		/*
		var reader = DataReader.fromBuffer(request.value)
		if (request.option == GattWriteOption.writeWithResponse) {
			request.Respond()
		}
		*/
	}

	_onSubscribedClientsChanged(TODO) {
		//sender.subscribedClients
	}

	// Web Bluetooth API
	async readValue() {
		if (!this.canRead) return
		let {status, value} = await this.uwpCharacteristic.readValueAsync()
		if (status !== GattCommunicationStatus.success)
			throw new Error(`Could not read value. ${getErrorName(status, GattCommunicationStatus)}`)
		if (value)
			return ibufferToBuffer(value)
	}

	// TODO
	// Web Bluetooth API
	async writeValue(buffer, withResponse = false) {
		if (!this.canWrite) return
		//if (!Buffer.isBuffer(buffer))
		if (typeof buffer === 'string')
			buffer = Buffer.from(buffer)
		var ibuffer = bufferToIbuffer(buffer)
		var writeOptions = withResponse ? GattWriteOption.writeWithResponse : GattWriteOption.writeWithoutResponse
		var {status} = await this.uwpCharacteristic.writeValueAsync(ibuffer, writeOptions)
		if (status !== GattCommunicationStatus.success)
			throw new Error(`Could not read value. ${getErrorName(status, GattCommunicationStatus)}`)
		// TODO: handle write with/without response.
	}

	// TODO
	notify(buffer) {
		// https://docs.microsoft.com/en-us/windows/uwp/devices-sensors/gatt-server#send-notifications-to-subscribed-clients
		var ibuffer = bufferToIbuffer(buffer)
		this.uwpCharacteristic.notifyValueAsync(ibuffer)
	}

	// TODO
	// Web Bluetooth API
	async startNotifications() {
		if (!this.canNotify) return
		var arg = GattClientCharacteristicConfigurationDescriptorValue.notify
		//var arg = GattClientCharacteristicConfigurationDescriptorValue.indicate
		var status = await this.uwpCharacteristic.writeClientCharacteristicConfigurationDescriptorAsync(arg)
		if (status !== GattCommunicationStatus.success)
			throw new Error(`Couldn't start listening for notifications ${getErrorName(status, GattCommunicationStatus)}`)
		// An Indicate or Notify reported that the value has changed.
		this.uwpCharacteristic.addEventListener('valuechanged', this._onValueChanged)
	}
	
	async stopNotifications() {
		this.uwpCharacteristic.removeEventListener('valuechanged', this._onValueChanged)
		// TODO: call the RidiculousThingamajigMethodToSetTheConfigDescriptor
	}

	// TODO: reroute UWP's 'valuechanged' events as Web Bluetooth's 'characteristicvaluechanged'
	// https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed-async-await.html
	addEventListener(name, callback) {
		//if (name === 'characteristicvaluechanged')
		// callback receives the value in event.target.value
	}

	// TODO: reroute UWP's 'valuechanged' events as Web Bluetooth's 'characteristicvaluechanged'
	// https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed-async-await.html
	removeEventListener(name, callback) {
		//if (name === 'characteristicvaluechanged')
		// callback receives the value in event.target.value
	}

}






export class UwpBluetooth extends UwpDeviceEnumerator {

	static DeviceConstructor = UwpBluetoothDevice

	// By default returns all devices (both BT & BT-LE) that are either paired or are available for pairing.
	// Based on:
	// - BluetoothDevice.getDeviceSelector() & BluetoothLEDevice.getDeviceSelector()
	// - BluetoothDevice.getDeviceSelectorFromPairingState(true)
	// - BluetoothLEDevice.getDeviceSelectorFromConnectionStatus(true)
	static getDeviceSelector(...args) {
		if (args.length === 1 && typeof args[0] === 'object')
			var {btRfcomm, btLowEnergy, isPaired, canPair, service} = args[0]
		else
			var {btRfcomm, btLowEnergy, isPaired, canPair, service} = args
		// WARNING: If isPaired and canPair are left without IssueInquiry, the query takes a lot more time.
		var stateList = [`System.Devices.Aep.Bluetooth.IssueInquiry:=${FALSE}`]
		if (isPaired !== false)
			stateList.push(`System.Devices.Aep.IsPaired:=${TRUE}`)
		if (canPair !== false)
			stateList.push(`System.Devices.Aep.CanPair:=${TRUE}`)
		var protocolList = []
		if (btRfcomm !== false)
			protocolList.push(`System.Devices.Aep.ProtocolId:="{${BLUETOOTH_RFCOMM_UUID}}"`)
		if (btLowEnergy !== false)
			protocolList.push(`System.Devices.Aep.ProtocolId:="{${BLUETOOTH_LE_UUID}}"`)
		// DevObjectType 5 ensures only devices are returned (it is critital it is a first argument).
		var conditions = []
		conditions.push(`System.Devices.DevObjectType:=5`)
		conditions.push('(' + protocolList.join(' OR ') + ')')
		conditions.push('(' + stateList.join(' OR ') + ')')
		if (typeof service === 'string')
			service = [service]
		if (Array.isArray(service)) {
			//`System.Devices.AepService.ServiceClassId:="{B142FC3E-FA4E-460B-8ABC-072B628B3C70}"`
			//`System.Devices.AepService.Bluetooth.ServiceGuid:="{00001101-0000-1000-8000-00805F9B34FB}"`
			let temp = service
				.map(BluetoothUUID.canonicalUUID)
				.map(uuid => `System.Devices.AepService.Bluetooth.ServiceGuid:="{${uuid}}"`)
			conditions.push('(' + temp.join(' OR ') + ')')
		}
		// WARNING: This order is necessary for the query to be fast.
		return conditions.join(' AND ')
	}

	async setup() {
		super.setup()
		// Returns object with local BT adapter's mac address as integer.
		this.uwpAdapter = await BluetoothAdapter.getDefaultAsync()
		this.isPeripheral = this.uwpAdapter && this.uwpAdapter.isPeripheralRoleSupported || false
		this.isClassic   = this.isClassicSupported   = this.uwpAdapter.isClassicSupported
		this.isLowEnergy = this.isLowEnergySupported = this.uwpAdapter.isLowEnergySupported
		this.isServer = this.uwpAdapter.isPeripheralRoleSupported
		this.isClient = this.uwpAdapter.isCentralRoleSupported
		//uwpAdapter.areClassicSecureConnectionsSupported
		//uwpAdapter.areLowEnergySecureConnectionsSupported
		//uwpAdapter.isAdvertisementOffloadSupported
		this.mac = ulongToMac(this.uwpAdapter.bluetoothAddress)
		this.uwpRadio = await this.uwpAdapter.getRadioAsync()
		// TODO
		this.uwpRadio.addEventListener('statechanged', (...args) => {
			// TODO
			console.log('statechanged', ...args)
		})
	}

	// might return undefined if the device does not have bluetooth radio
	get isOn() {
		if (this.uwpRadio && this.uwpRadio.state !== RadioState.disabled)
			return this.uwpRadio.state === RadioState.on
	}
	get isOff() {
		if (this.uwpRadio && this.uwpRadio.state !== RadioState.disabled)
			return this.uwpRadio.state === RadioState.off
	}

	async turnOn() {
		if (this.uwpRadio)
			return wrapUwpPromise(this.uwpRadio.setStateAsync(RadioState.on))
		else
			throw new Error(`There's no bluetooth radio to be disabled`)
	}

	async turnOff() {
		if (this.uwpRadio)
			return wrapUwpPromise(this.uwpRadio.setStateAsync(RadioState.off))
		else
			throw new Error(`There's no bluetooth radio to be disabled`)
	}


	// TODO
	// WARNING: highly experimental
	createLeAdWatcher() {
		var running = false
		var adWatcher = new BluetoothLEAdvertisementWatcher()
		//{
		//	SignalStrengthFilter.InRangeThresholdInDBm = -100,
		//	SignalStrengthFilter.OutOfRangeThresholdInDBm = -102,
		//	SignalStrengthFilter.OutOfRangeTimeout = TimeSpan.FromMilliseconds(2000)
		//};
		adWatcher.addEventListener('received', e => {})
		adWatcher.addEventListener('stopped', e => {
			// Advertisements has been cancelled or aborted either by the app or due to an error.
			running = false
		})
		running = true
		adWatcher.start()
		//adWatcher.stop()
	}

	// TODO
	// NOTE: Can't currently test it because apparently Windows laptop can't be a BTLE server.
	async createGattService(...args) {
		// TODO. move elsewhere
		if (!this.isPeripheral)
			console.warn(`This device does not support peripheral role.`)
		var provider = await BluetoothService.createGatt(...args)
		// TODO: handle characteristic events. specifically ReadRequested, WriteRequested.
		//       Probably wrap each service in the BluetoothCharacteristic (and or Socket) class
		//       https://docs.microsoft.com/en-us/windows/uwp/devices-sensors/gatt-server
		var params = new GattServiceProviderAdvertisingParameters()
		params.isDiscoverable = true
		params.isConnectable = this.isPeripheral
		provider.startAdvertising(params)
		// TODO: test if the event name should be camelcase or lowercase (docs says camel, incorrectly from experience,
		// docs are automatically generated from C# docs and the event names are usually lowercase in JS)
		provider.addEventListener('advertisementstatuschanged', (...args) => {
			// TODO
			console.log('advertisementstatuschanged', ...args)
		})
	}

	// WARNING:
	// UWP weirdly reverses order of (pairs in) given UUIDs.
	// For example this: '01234567-89AB-CDEF-0123-456789ABCDEF'
	// is turned into:   'EFCDAB89-6745-2301-EFCD-AB8967452301' 
	async createClassicService(uuid, name, protection, attributes) {
		if (typeof Server === undefined)
			throw new Error(`Module 'uwp-net' is needed for creating bluetooth servers.`)
		if (protection === undefined)
			protection = SocketProtectionLevel.bluetoothEncryptionAllowNullAuthentication
		// Start advertising.
		var provider = await BluetoothService.createRfcomm(uuid, name, attributes)
		var server = new Server
		await server.listenAsync(provider.serviceId.asString(), protection)
		provider.startAdvertising(server._handle, true)
		return server
	}

	// TODO
	// Web Bluetooth api
	// https://googlechrome.github.io/samples/web-bluetooth/device-info-async-await.html
	// https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics-async-await.html
	requestDevice(options) {
		// TODO
		// opens picker
	}

}


export default new UwpBluetooth({autoStart: false})
