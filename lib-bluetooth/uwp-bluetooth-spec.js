import {sdpArray} from './spec-sdp.js'
import {gattArray} from './spec-gatt.js'


export var sdp = {}
export var sdpServices = {}
export var sdpAttributes = {}
export var gatt = {}
export var gattServices = {}
export var gattCharacteristics = {}

const BASE_UUID_END = '-0000-1000-8000-00805f9b34fb'

function handleUuid(record) {
	var id = record.id.toLowerCase()
	var uuid = id.toString(16).padStart(8, '0') + BASE_UUID_END
	record.uuid = uuid
	var idUpper = id.toUpperCase()
	var uuidUpper = uuid.toUpperCase()
	return {id, uuid, idUpper, uuidUpper}
}

export function registerSdp(record) {
	var {id, uuid, idUpper, uuidUpper} = handleUuid(record)
	sdp[id] = sdp[uuid] = sdp[idUpper] = sdp[uuidUpper] = record
	if (record.type === 'service')
		sdpServices[id] = sdpServices[uuid] = sdpServices[idUpper] = sdpServices[uuidUpper] = record
	else if (record.type === 'attribute')
		sdpAttributes[id] = sdpAttributes[uuid] = sdpAttributes[idUpper] = sdpAttributes[uuidUpper] = record
}

export function registerGatt(record) {
	var {id, uuid, idUpper, uuidUpper} = handleUuid(record)
	gatt[id] = gatt[uuid] = gatt[idUpper] = gatt[uuidUpper] = record
	if (record.type === 'service')
		gattServices[id] = gattServices[uuid] = gattServices[idUpper] = gattServices[uuidUpper] = record
	else if (record.type === 'attribute')
		gattCharacteristics[id] = gattCharacteristics[uuid] = gattCharacteristics[idUpper] = gattCharacteristics[uuidUpper] = record
}

sdpArray.forEach(registerSdp)
gattArray.forEach(registerGatt)
