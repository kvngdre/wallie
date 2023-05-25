/**
 * @template T - The value type
 * @description A function that validates an object and returns its value or an error
 * @typedef {(obj: Object.<string, *>) => {value: T, error: (Object.<string, string>|undefined)}} ValidationFunction
 * @param {Object.<string, *>} obj - The object to validate.
 * @returns {{value: T, error: (Object.<string, string>|undefined)}} - The validation result.
 */

/**
 * @description A controller function for express applications
 * @typedef {(req: import('express').Request, res:import('express').Response) => Promise<void>} ControllerFunction
 * @param {import('express').Request} req - The incoming request object.
 * @param {import('express').Response} res - The outgoing response object.
 * @returns {Promise<void>}
 */
