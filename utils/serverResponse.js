/**
 * Creates a new Server Response.
 * @class
 */
class ServerResponse {
    #code;
    #data;
    #message;
    #name;
    #isError;
    /**
     * @constructs ServerResponse
     * @param {Object} param
     * @param {boolean} [param.isError=false] - The response status
     * @param {number} [param.code=200] - The HTTP status code
     * @param {string} [param.msg=successful] - The response message.
     * @param {Object} param.data - The data to be send.
     */
    constructor({ isError = false, code = 200, msg = 'successful', data }) {
        this.#code = code;
        this.#data = data;
        this.#message = msg;
        this.#name = this.constructor.name;
        this.#isError = isError;
    }

    get isError() {
        return this.#isError;
    }

    get code() {
        return this.#code;
    }

    get payload() {
        const obj = {
            success: !this.#isError,
            message: this.#message,
        };
        if (this.#data) obj.data = this.#data;
        return obj;
    }
}

module.exports = ServerResponse;
