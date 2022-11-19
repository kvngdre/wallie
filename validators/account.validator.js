const joi = require('joi');

class AccountValidators {
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

    validateCreate(account) {
        const schema = joi.object({
            userId: this.#userIdSchema.required(),
        });
        return schema.validate(account);
    }

    validateEdit(account) {
        const schema = joi.object({
            balance: this.#balanceSchema,
        });
        return schema.validate(account);
    }

    validateAmount(amount) {
        const schema = joi.number().label('Amount').positive().required();
        return schema.validate(amount);
    }
}

module.exports = new AccountValidators();
