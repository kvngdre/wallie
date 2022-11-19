const joi = require('joi');

class AccountValidators {
    #amountSchema = joi.number().label('Amount').positive();

    #balanceSchema = joi
        .number()
        .min(0)
        .max(999999.99)
        .precision(2)
        .label('Balance')
        .messages({
            'number.max': '{#label} must be less than or equal to {#limit}',
        });

    #userIdSchema = joi.number().positive().label('User Id');

    validateCreate(dto) {
        const schema = joi.object({
            userId: this.#userIdSchema.required(),
        });
        return schema.validate(dto);
    }

    validateAmount(amount) {
        const schema = this.#amountSchema.required();
        return schema.validate(amount);
    }

    validateTransfer(dto) {
        const schema = joi.object({
            amount: this.#amountSchema.required(),
            destinationAccountId: joi
                .number()
                .label('Destination account id')
                .positive()
                .required(),
        });
        return schema.validate(dto);
    }
}

module.exports = new AccountValidators();
