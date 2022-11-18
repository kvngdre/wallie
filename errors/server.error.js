const ServerResponse = require('../utils/serverResponse');

class ServerError extends ServerResponse {
    #code;
    #message;
    #name;
    #data;
    constructor(code, message) {
        super(code, message);
        this.#code = code;
        // this.#message = message;
        this.#name = this.constructor.name;
        Error?.captureStackTrace(this, this.constructor);
    }

    // get payload() {
    //     return {
    //         success: false,
    //         message: this.#message,
    //     };
    // }
}

module.exports = ServerError;
