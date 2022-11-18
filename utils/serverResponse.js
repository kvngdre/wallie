/**
 * Creates a new Server Response.
 * @class
 */
class ServerResponse extends Error {
    /**
     * @constructs ServerResponse
     * @param {Object} param
     * @param {boolean} [param.isError=false] - Specifies if it is an error response.
     * @param {number} [param.code=200] - The HTTP status code
     * @param {message} param.message - The response message.
     * @param {Object} param.data - The payload to the response.
     */
    constructor({ isError = false, code = 200, message, data }) {
        super();
        this.isError = isError;
        this.code = code;
        this.message = message;
        this.data = data;
        this.name = this.constructor.name;

        if (!this.isError) {
            this.error = {
                success: this.isError,
                message: this.message,
                data: this.data,
            };
        } else {
            this.value = {
                success: this.isError,
                message: this.message,
                data: this.data,
            };
        }
    }

    error = null;
    value = null;
}

module.exports = ServerResponse;
