/**
 * Creates a new Server Response.
 * @class
 */
class ServerResponse {
    #code;
    #data;
    #message;
    #name;
    /**
     * @constructs ServerResponse
     * @param {number} [code=200] - The HTTP status code
     * @param {string} [message=successful] - The response message.
     * @param {Object} data - The data to be send.
     */
    constructor(code, message, data) {
        this.#code = code;
        this.#data = data;
        this.#message = message;
        this.#name = this.constructor.name;
    }

    get isError() {
        return this.#code >= 400 ? true : false;
    }

    get code() {
        return this.#code;
    }

    get payload() {
        return {
            success: !this.isError,
            message: this.#message,
            data: this.#data ? this.#data : undefined,
        };
    }
}

module.exports = ServerResponse;
