import * as types from '@/utils/types'

export const enums = (...enums) => prop => enums.includes(prop)

export const schema = schema => prop => Object.entries(schema).every(([key, rule]) => (
  types.isFunction(rule) ? rule(prop[key])
    : `is${rule.name}` in types ? types[`is${rule.name}`](prop[key])
      : types.isInstance(rule)(prop)
))

export const or = (...validators) => prop => validators.some(validator => validator(prop))
