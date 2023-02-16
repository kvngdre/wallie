const ValidationException = require('../errors/ValidationError');

module.exports = (req, res, next) => {
    const { params } = req;

    if (
        isNaN(params.id) ||
        params.id < 1 ||
        !Number.isInteger(Number(params.id))
    )
        throw new ValidationException('Invalid ID');

    next();
};
