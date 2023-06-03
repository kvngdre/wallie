import Joi from 'joi';
import { TxnPurpose, TxnType } from '../utils/common.utils.js';

class TransactionValidator {
  #amountSchema;
  #balanceSchema;
  #descSchema;
  #idSchema;
  #txnTypeSchema;
  #txnPurposeSchema;

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
    this.#txnTypeSchema = Joi.string()
      .valid(...Object.values(TxnType))
      .label('Type');
    this.#txnPurposeSchema = Joi.string()
      .valid(...Object.values(TxnPurpose))
      .label('Purpose');
  }

  validateNewTxnDto = (newTxnDto) => {
    // TODO: write conditional validator for purpose, bal_before and after
    const schema = Joi.object({
      account_id: this.#idSchema.label('Account id').required(),
      type: this.#txnTypeSchema.required(),
      purpose: this.#txnPurposeSchema.required(),
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
