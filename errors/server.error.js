class ServerError extends Error {
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
        this.name = this.constructor.name;
        Error?.captureStackTrace(this, this.constructor);
    }

    get getErrorObj() {
        return {
            success: false,
            message: this.message,
        };
    }
}

module.exports = ServerError;
