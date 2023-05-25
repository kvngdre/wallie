import BaseError from '../errors/base.error';

/**
 * @template T - The value type
 * @description A function that validates an object and returns its value or an error
 * @typedef {(obj: Object.<string, *>) => {value: T, error: (Object.<string, string>|undefined)}} ValidationFunction
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
 *  err: (Error|BaseError),
 *  req: import('express').Request,
 *  res: import('express').Response,
 *  next: import('express').NextFunction) => any} ErrorMiddlewareFunction
 * @param {import('express').Request} req - The incoming request object.
 * @param {import('express').Response} res - The outgoing response object.
 * @param {import('express').NextFunction} next - The next middleware function in the chain.
 */
