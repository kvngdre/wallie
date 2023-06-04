export default class ApiResponse {
  /**
   * A class that represents a successful API response with generic data.
   * @class ApiResponse
   * @param {string} message - Response message.
   * @param {*} [data] - Response data. Optional.
   * @param {*} [meta] - Response meta. Optional.
   */
  constructor(message, data, meta) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}
