/**
 * @template T
 * @typedef {function(Object.<string, *>):{value: T, error: (Object.<string, string>|undefined)}} ValidationFunction
 * @param {Object.<string, *>} obj - The object to validate.
 * @returns {{value: T, error: (Object.<string, string>|undefined)}} - The validation result.
 * @description A function that validates an object and returns its value or an error
 */
