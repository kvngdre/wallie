/**
 * Creates a new Server Response.
 * @class
 */
class ServerResponse extends Error {
    #name;
    #code;

    /**
     * @constructs ServerResponse
     * @param {string} message - The response message.
     * @param {number} code - The HTTP status code.
     * @param {Object} [data] - The data to be send.
     */
    constructor(message, code, data = undefined) {
        super();

        this.#name = this.constructor.name;
        this.#code = code;
        this.success = code < 400 ? true : false;
        this.message = message;
        this.data = data;
        // this.errors = this.success ? undefined : { message, ...data };

        Error?.captureStackTrace(this, this.constructor);
    }

    static get _500() {
        const payload = {
            success: false,
            message: 'Something went wrong.',
        };
        Object.defineProperty(payload, 'code', { value: 500 });

        return payload;
    }

    get code() {
        return this.#code;
    }
}

module.exports = ServerResponse;
