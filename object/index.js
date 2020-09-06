const util = require('util')

/**
 * Checks if `key` has been seen before.
 */
hash = new Map();
const isDuplicate = key => {
	if (!hash.has(key)) hash.set(key, true)
	else return true
	return false
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
const isObject = item => item && typeof item === 'object' && !Array.isArray(item);
  
/**
 * Deep merge objects into target.
 * @param target
 * @param ...sources
 */
const deepMerge = (target, ...sources) => {
	if (!sources.length) return target;
	const source = sources.shift();
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key], source[key]);
			} else Object.assign(target, { [key]: source[key] });
		}
	}
	return deepMerge(target, ...sources);
}

/**
 * Take in a target `object` and a `types` object with identical keys but values as array of types those keys should be.
 * @param {object} target Object
 * @param {object} types Object identical to `target` but values are types
 * @returns {boolean} `False` if the types dont match. `True` if they do.
 */
const deepTypeCompare = (target, types) => {
	if (!(isObject(target) && isObject(types))) return false
	for (const key in target) {
		if (isObject(target[key])) {
			if (!deepTypeCompare(target[key], types[key])) return false
		} else {
			if (Array.isArray(target[key]) && Array.isArray(types[key])) { // Both are array
				const childCheckType = type(types[key][0])
				if (!target[key].some(targetType => targetType === childCheckType)) return false
			} else {
				if (!Array.isArray(types[key])) types[key] = [types[key]]
				const targetType = type(target[key])
				if (!types[key].some(checkType => targetType === checkType)) return false
			}
		}
	}
	return true
}

/**
 * Returns the type of `item` respecting `Array`, `null` and `undefined` unlike typeof.
 * @param {*} item 
 * @returns {string} Type of item
 */
const type = item => {
	if (Array.isArray(item)) return 'array'
	if (item === null) return 'null'
	if (item === undefined) return 'undefined'
	return typeof item
}

/**
 * Breaks `array` into smaller chunks based on `chunkSize`
 * @param {Array} array Array to break up.
 * @param {number} chunkSize Maximum size of array chunks.
 * 
 * @returns {Array<Array>} Array containing array chunks.
 */
const chunkArray = (array, chunkSize) => {
	if (array.length < chunkSize) return [array]
	let i, j, returnArray = []
	for (i = 0, j = array.length; i < j; i += chunkSize) returnArray.push(array.slice(i, i + chunkSize));
	return returnArray
}

/**
 * Stringifies and then parses a object to convert it to a JSON supported object.
 * @param {Object} obj Object to convert.
 * @example
 * const obj = { 
 * 	a: 1, 
 * 	b: [2, 7] 
 * }
 * const a = objectify(obj)
 * const b = JSON.parse(JSON.stringify(obj))
 * console.log(a == b) -> true
 */
const objectify = obj => JSON.parse(JSON.stringify(obj))

/**
 * Logs a inspected object to console
 * @param {*} obj Object to inspect
 * @param {boolean} showHidden Show hidden properties of object
 * @param {number} depth Depth to inspect object
 * @param {boolean} color Color resulting output
 * @returns {void}
 */
const lObj = (obj, showHidden=false, depth=5, color=true) => console.log(util.inspect(obj, showHidden, depth, color))

/**
 * Inspects a object
 * @param {*} obj Object to inspect
 * @param {boolean} showHidden Show hidden properties of object
 * @param {number} depth Depth to inspect object
 * @param {boolean} color Color resulting output
 * @returns {string}
 */
const iObj = (obj, showHidden=false, depth=5, color=true) => util.inspect(obj, showHidden, depth, color)

/**
 * Pad a number with 0's
 * @param {number} num Number to pad.
 * @param {number} zeros Number of digits returned number should have.
 * 
 * @returns {string} Padded number
 * @example
 * let paddedNumber = nPad(5)
 * // paddedNumber = "05"
 * let triplePaddedNumber = nPad(6, 3)
 * // triplePaddedNumber = "006"
 */
const nPad = (num, zeros=2) => {
	num = num.toString()
	while (num.length < zeros) num = '0'+num
	return num
}

module.exports = { isDuplicate, chunkArray, objectify, lObj, iObj, isObject, deepMerge, deepTypeCompare, type, nPad }