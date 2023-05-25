/**
 * Creates a new API Response.
 * @class
 */
export class ApiResponse {
  /**
   * @constructs APIResponse
   * @param {string} message - The response message.
   * @param {Object} [data] - Response data.
   */
  constructor(message, data = undefined, meta = undefined) {
    this.success = true;
    this.body = {
      message,
      data,
      meta,
    };
  }
}
