import Joi from 'joi';
import {
  coerceNumber,
  refineValidationError,
} from '../helpers/validation.helpers.js';
import { operatorMap } from '../utils/common.utils.js';
import {
  TransactionPurpose,
  TransactionType,
} from './jsdoc/transaction.types.js';

class TransactionValidator {
  #amountSchema;
  #balanceSchema;
  #descSchema;
  #idSchema;
  #transactionTypeSchema;
  #transactionPurposeSchema;

  constructor() {
    this.#amountSchema = Joi.number().label('Amount').precision(2).positive();

    this.#balanceSchema = Joi.number()
      .min(0)
      .max(999999.99)
      .precision(2)
      .messages({
        'number.max': '{#label} must be less than or equal to {#limit}',
      });

    this.#descSchema = Joi.string().max(50).label('Description');

    this.#idSchema = Joi.string().pattern(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    );

    this.#transactionTypeSchema = Joi.string()
      .label('Type')
      .valid(...Object.values(TransactionType));

    this.#transactionPurposeSchema = Joi.string()
      .label('Purpose')
      .valid(...Object.values(TransactionPurpose));
  }

  validateNewTxnDto = (newTxnDto) => {
    // TODO: write conditional validator for purpose, bal_before and after
    const schema = Joi.object({
      account_id: this.#idSchema.label('Account ID').required(),
      type: this.#transactionTypeSchema.required(),
      purpose: this.#transactionPurposeSchema.required(),
      amount: this.#amountSchema.required(),
      description: this.#descSchema,
      balance_before: this.#balanceSchema.label('Balance before').required(),
      balance_after: this.#balanceSchema.label('Balance after').required(),
    });

    return schema.validate(newTxnDto);
  };

  /** @type {ValidationFunction<import('./dto/transaction-filter.dto.js').TransactionFilter>} */
  validateTransactionFilter = (dto) => {
    const schema = Joi.object({
      account_id: this.#idSchema.label('Account ID'),
      type: this.#transactionTypeSchema,
      purpose: this.#transactionPurposeSchema,
      value: Joi.number().label('Value').custom(coerceNumber),
      operator: Joi.string()
        .label('Operator')
        .trim()
        .lowercase()
        .valid(...Object.keys(operatorMap)),
    }).and('value', 'operator');

    let { value, error } = schema.validate(dto, { abortEarly: false });
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  validateUpdateTxnDto = (updateTxnDto) => {
    const schema = Joi.object({
      description: this.#descSchema,
    });

    return schema.validate(updateTxnDto);
  };
}

export default TransactionValidator;
