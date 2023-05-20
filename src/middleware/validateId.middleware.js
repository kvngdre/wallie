import ValidationError from '../errors/validation.error.js';

export default (req, res, next) => {
  const { params } = req;

  if (isNaN(params.id) || params.id < 1 || !Number.isInteger(Number(params.id)))
    throw new ValidationError('Invalid ID');

  next();
};
