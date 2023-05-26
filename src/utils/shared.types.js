/**
 * @template T
 * @typedef {Object} ValidationResult
 * @property {T} value,
 * @property {(Object.<string, string>|undefined)} error
 */

/**
 * @template T - The value type
 * @description A function that validates an object and returns its value or an error
 * @typedef {function(Object.<string, *>): ValidationResult<T>} ValidationFunction
 * @param {Object.<string, *>} obj - The object to validate.
 * @returns {{value: T, error: (Object.<string, string>|undefined)}} - The validation result.
 */

/**
 * @template [ParamsDirectory]
 * @template [ResBody]
 * @template [ReqBody]
 * @template [ReqQuery]
 * @description A controller function for express applications
 * @typedef {(
 *  req: import('express').Request<ParamsDirectory, ResBody, ReqBody, ReqQuery>,
 *  res:import('express').Response) => Promise<void>} ControllerFunction
 * @param {import('express').Request} req - The incoming request object.
 * @param {import('express').Response} res - The outgoing response object.
 * @returns {Promise<void>}
 */

/**
 * @template {any} [FnReturnType=any] - The return type of the middleware function.
 * @description A middleware function for express applications
 * @typedef {(
 *  req: import('express').Request,
 *  res: import('express').Response,
 *  next: import('express').NextFunction) => FnReturnType} MiddlewareFunction
 * @param {import('express').Request} req - The incoming request object.
 * @param {import('express').Response} res - The outgoing response object.
 * @param {import('express').NextFunction} next - The next middleware function in the chain.
 * @returns {FnReturnType}
 */

/**
 * @description An error middleware function for express applications
 * @typedef {(
 *  err: (Error|import('../errors/base.error.js').default),
 *  req: import('express').Request,
 *  res: import('express').Response,
 *  next: import('express').NextFunction) => any} ErrorMiddlewareFunction
 * @param {import('express').Request} req - The incoming request object.
 * @param {import('express').Response} res - The outgoing response object.
 * @param {import('express').NextFunction} next - The next middleware function in the chain.
 */
