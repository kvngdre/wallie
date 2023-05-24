/**
 * Creates a new API Response.
 * @class
 */
export default class APIResponse {
  /**
   * @constructs APIResponse
   * @param {string} message - The response message.
   * @param {Object} [data] - Response data.
   */
  constructor(message, data = undefined) {
    this.success = true;
    this.body = {
      message,
      data,
    };
  }
}
