import Joi from 'joi';
import { refineValidationError } from '../helpers/validation.helpers.js';
import { TransactionType } from '../transaction/jsdoc/transaction.types.js';
import { operatorMap } from './utils/operator-map.utils.js';

export default class AccountValidator {
  #amountSchema;
  #descriptionSchema;
  #idSchema;
  #pinSchema;

  constructor() {
    this.#amountSchema = Joi.number().label('Amount').positive().precision(2);

    this.#descriptionSchema = Joi.string().max(50).label('Description');

    this.#idSchema = Joi.string().pattern(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    );

    this.#pinSchema = Joi.string()
      .length(4)
      .pattern(/^[0-9]{4}$/)
      .label('Pin')
      .messages({
        'string.length': '{#label} must be {#limit} digits long',
        'string.pattern.base': '{#label} can only be numbers',
      });
  }

  /** @type {ValidationFunction<CreateAccountDto>} */
  validateCreateAccount = (dto) => {
    const schema = Joi.object({
      user_id: this.#idSchema.label('User id').required(),
      pin: this.#pinSchema.required(),
    });

    let { value, error } = schema.validate(dto, { abortEarly: false });
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<AccountFilter>} */
  validateAccountFilter = (dto) => {
    const schema = Joi.object({
      value: Joi.number().custom(coerceNumber),
      operator: Joi.string()
        .trim()
        .lowercase()
        .valid(...Object.keys(operatorMap)),
    }).and('value', 'operator');

    let { value, error } = schema.validate(dto);
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<ChangePinDto>} */
  validateChangePin = (dto) => {
    const schema = Joi.object({
      pin: this.#pinSchema,
    });

    let { value, error } = schema.validate(dto);
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<import('./dto/credit-account.dto.js').CreditAccountDto>} */
  validateCreditAccount = (dto) => {
    const schema = Joi.object({
      type: Joi.string().equal(TransactionType.CREDIT).required(),
      amount: this.#amountSchema.required(),
      description: this.#descriptionSchema,
    });

    let { value, error } = schema.validate(dto, {
      abortEarly: false,
      convert: false,
    });

    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<DebitAccountDto>} */
  validateDebitAccount = (dto) => {
    const schema = Joi.object({
      amount: this.#amountSchema.required(),
      pin: this.#pinSchema.required(),
      description: this.#descriptionSchema,
    });

    let { value, error } = schema.validate(dto, {
      abortEarly: false,
      convert: false,
    });

    if (error) error = refineValidationError(error);

    return { value, error };
  };

  validateTransferDto = (transferDto, currentUser) => {
    const schema = Joi.object({
      amount: this.#amountSchema.required(),
      dest_id: this.#idSchema
        .label('Destination account id')
        .invalid(currentUser.id)
        .required(),
      pin: this.#pinSchema.required(),
      desc: this.#descriptionSchema,
    });
    return schema.validate(transferDto);
  };
}

// Define a custom function to coerce a numeric string to a number
const coerceNumber = (value, helpers) => {
  // Check if the value is a string and contains only digits and optional decimal point
  if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)) {
    // Convert the value to a number using parseFloat or Number
    return parseFloat(value);
    // Alternatively, you can use Number(value)
  }
  // Return the original value otherwise
  return value;
};
