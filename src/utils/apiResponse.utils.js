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
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
