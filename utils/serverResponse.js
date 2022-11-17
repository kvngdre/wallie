class ServerResponse extends Error {
    constructor() {
        super();
        // this.code = code;
        // this.message = message;
        // this.data = data;
        this.name = this.constructor.name;
        Error?.captureStackTrace(this, this.constructor);
    }

    err = null;
    val = null;
    code = null;
    message = null;
    #data = null;

    error(code, message) {
        this.code = code;
        this.message = message;
        this.err = {
            success: false,
            message: this.message
        }
        return this;
    }

    send(message, data) {
        this.message = message;
        this.#data = data;
        this.val = {
            success: true,
            message: this.message,
            data: this.data
        }
        return this;
    }
    
}

const sr = new ServerResponse();
sr.error()

module.exports = ServerResponse;
