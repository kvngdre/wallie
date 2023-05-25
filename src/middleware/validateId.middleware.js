import HttpCode from '../utils/httpCodes.utils.js';

/** @type {MiddlewareFunction} */
export default function validateId(req, res, next) {
  // * Match any key that ends with Id or is id (case-insensitive).
  const ID_PATTERN = /[a-z]+Id$|^[iI]d$/g;

  // * Match any UUID v4
  const UUID_V4_PATTERN =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  const { params } = req;

  for (const key in params) {
    // * Check if the key matches the ID pattern and the value does not match the UUID v4 pattern.
    if (ID_PATTERN.test(key) && !UUID_V4_PATTERN.test(params[key])) {
      /*
       * Format the key to a human-readable message by inserting a space
       * between lowercase and uppercase letters and converting to lowercase.
       */
      const message = 'Invalid '.concat(
        key.replace(/([a-z])([A-Z])/, '$1 $2').toLowerCase(),
      );

      return res.status(HttpCode.BAD_REQUEST).json({ success: false, message });
    }
  }

  // Call the next middleware function in the chain
  next();
}
