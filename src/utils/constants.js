const httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
};

const txnTypes = {
    CREDIT: 'credit',
    DEBIT: 'debit'
}

const txnPurposes = {
    DEPOSIT: 'deposit',
    TRANSFER: 'transfer',
    WITHDRAW: 'withdrawal'
}

module.exports = {
    httpStatusCodes,
    txnPurposes,
    txnTypes,
};
