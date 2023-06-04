import Joi from 'joi';
import {
  TransactionPurpose,
  TransactionType,
} from './jsdoc/transaction.types.js';

class TransactionValidator {
  #amountSchema;
  #balanceSchema;
  #descSchema;
  #idSchema;
  #TransactionTypeSchema;
  #TransactionPurposeSchema;

  constructor() {
    this.#amountSchema = Joi.number().label('Amount').positive();
    this.#balanceSchema = Joi.number()
      .min(0)
      .max(999999.99)
      .precision(2)
      .messages({
        'number.max': '{#label} must be less than or equal to {#limit}',
      });
    this.#descSchema = Joi.string().max(50).label('Description');
    this.#idSchema = Joi.number().positive();
    this.#TransactionTypeSchema = Joi.string()
      .valid(...Object.values(TransactionType))
      .label('Type');
    this.#TransactionPurposeSchema = Joi.string()
      .valid(...Object.values(TransactionPurpose))
      .label('Purpose');
  }

  validateNewTxnDto = (newTxnDto) => {
    // TODO: write conditional validator for purpose, bal_before and after
    const schema = Joi.object({
      account_id: this.#idSchema.label('Account id').required(),
      type: this.#TransactionTypeSchema.required(),
      purpose: this.#TransactionPurposeSchema.required(),
      amount: this.#amountSchema.required(),
      description: this.#descSchema,
      bal_before: this.#balanceSchema.label('Balance before').required(),
      bal_after: this.#balanceSchema.label('Balance after').required(),
    });

    return schema.validate(newTxnDto);
  };

  validateUpdateTxnDto = (updateTxnDto) => {
    const schema = Joi.object({
      description: this.#descSchema,
    });

    return schema.validate(updateTxnDto);
  };
}

export default TransactionValidator;
