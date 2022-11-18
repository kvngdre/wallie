/**
 * Creates a new Server Response.
 * @class
 */
class ServerResponse {
    #code;
    #data;
    #message;
    #name;
    #status;
    /**
     * @constructs ServerResponse
     * @param {Object} param
     * @param {boolean} [param.status=true] - The response status
     * @param {number} [param.code=200] - The HTTP status code
     * @param {string} param.msg - The response message.
     * @param {Object} param.data - The data to be send.
     */
    constructor({ status = true, code = 200, msg, data }) {
        this.#code = code;
        this.#data = data;
        this.#message = msg;
        this.#name = this.constructor.name;
        this.#status = status;
    }

    get isError() {
        return !this.#status;
    }

    get code() {
        return this.#code;
    }

    get payload() {
        const obj = {
            success: this.#status,
            message: this.#message,
        };
        if (this.#data) obj.data = this.#data;
        return obj;
    }
}

module.exports = ServerResponse;
