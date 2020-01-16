export const isString = val => typeof val === 'string'
export const isNumber = val => typeof val === 'number'
export const isBoolean = val => typeof val === 'boolean'
export const isFunction = val => typeof val === 'function'
export const isObject = val => typeof val === 'object'
export const isArray = val => Array.isArray(val)
export const isInstance = constructor => val => val instanceof constructor
