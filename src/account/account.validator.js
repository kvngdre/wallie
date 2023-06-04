import Joi from 'joi';
import {
  coerceNumber,
  refineValidationError,
} from '../helpers/validation.helpers.js';
import { TransactionType } from '../transaction/jsdoc/transaction.types.js';
import { operatorMap } from '../utils/common.utils.js';

class AccountValidator {
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

    let { value, error } = schema.validate(dto, { abortEarly: false });
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<ChangePinDto>} */
  validateChangePin = (dto) => {
    const schema = Joi.object({
      pin: this.#pinSchema,
    });

    let { value, error } = schema.validate(dto, { abortEarly: false });
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<import('./dto/credit-account.dto.js').CreditAccountDto>} */
  validateCreditAccount = (dto) => {
    const schema = Joi.object({
      type: Joi.string().label('Type').equal(TransactionType.CREDIT).required(),
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
      type: Joi.string().label('Type').equal(TransactionType.DEBIT).required(),
      amount: this.#amountSchema.required(),
      description: this.#descriptionSchema,
      pin: this.#pinSchema.required(),
    });

    let { value, error } = schema.validate(dto, {
      abortEarly: false,
      convert: false,
    });

    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<import('./dto/transfer-funds.dto.js').TransferFundsDto>} */
  validateFundsTransfer = (dto) => {
    const schema = Joi.object({
      type: Joi.string()
        .label('Type')
        .equal(TransactionType.TRANSFER)
        .required(),
      destination_account: this.#idSchema
        .label('Destination account')
        .required(),
      amount: this.#amountSchema.required(),
      description: this.#descriptionSchema,
      pin: this.#pinSchema.required(),
    });

    let { value, error } = schema.validate(dto, {
      abortEarly: false,
      convert: false,
    });

    if (error) error = refineValidationError(error);

    return { value, error };
  };
}

export default AccountValidator;
