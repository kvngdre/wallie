/**
 * The possible values for HTTP status code.
 * @enum {string}
 */
const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  FOUND_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  DEPENDENCY: 424,
  INTERNAL_SERVER: 500,
};

export default HttpCode;
