import fs from 'fs'
import babel from 'rollup-plugin-babel'


var pkg = JSON.parse(fs.readFileSync('package.json').toString())
var nodeCoreModules = require('repl')._builtinLibs
var external = [...nodeCoreModules, ...Object.keys(pkg.dependencies || {})]
external.push('uwp-socket')
external.push('uwp-net')
external.push('uwp-serial')
external.push('uwp-bluetooth')
external.push('uwp-bluetooth-spec')
var globals = objectFromArray(external)

var babelConfig = {
	plugins: ["transform-class-properties"]
}

export default [
	{
		treeshake: false,
		plugins: [babel(babelConfig)],
		external,
		input: 'lib/uwp-socket.js',
		output: {
			file: `dist/uwp-socket.js`,
			format: 'umd',
			name: 'uwp-socket',
			globals,
		}
	}, {
		treeshake: false,
		plugins: [babel(babelConfig)],
		external,
		input: 'lib-net/uwp-net.js',
		output: {
			file: `dist/uwp-net.js`,
			format: 'umd',
			name: 'uwp-net',
			globals,
		}
	}, {
		treeshake: false,
		plugins: [babel(babelConfig)],
		external,
		input: 'lib-bluetooth/uwp-bluetooth.js',
		output: {
			file: `dist/uwp-bluetooth.js`,
			format: 'umd',
			name: 'uwp-bluetooth',
			globals,
		}
	}, {
		treeshake: false,
		plugins: [babel(babelConfig)],
		external,
		input: 'lib-bluetooth/uwp-bluetooth-spec.js',
		output: {
			file: `dist/uwp-bluetooth-spec.js`,
			format: 'umd',
			name: 'uwp-bluetooth-spec',
			globals,
		}
	}
]

function objectFromArray(arr) {
	var obj = {}
	arr.forEach(moduleName => obj[moduleName] = moduleName)
	return obj
}