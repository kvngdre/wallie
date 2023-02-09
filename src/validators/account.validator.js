const Joi = require('joi');

class AccountValidators {
    #amountSchema;
    #descSchema;
    #idSchema;
    #pinSchema;
    constructor() {
        this.#amountSchema = Joi.number().label('Amount').positive();
        this.#descSchema = Joi.string().max(50).label('Description');
        this.#idSchema = Joi.number().positive();
        this.#pinSchema = Joi.string()
            .length(4)
            .pattern(/^[0-9]{4}$/)
            .label('Pin')
            .messages({
                'string.length': '{#label} must be {#limit} digits long',
                'string.pattern.base': 'Invalid {#label}. Only numbers allowed.',
            });
    }

    validateNewAccountDto = (newAccountDto) => {
        const schema = Joi.object({
            pin: this.#pinSchema.required(),
        });
        return schema.validate(newAccountDto);
    };

    validateCreditAccountDto = (accountEntryDto) => {
        const schema = Joi.object({
            amount: this.#amountSchema.required(),
            desc: this.#descSchema,
        });
        return schema.validate(accountEntryDto);
    };

    validateDebitAccountDto = (accountEntryDto) => {
        const schema = Joi.object({
            amount: this.#amountSchema.required(),
            pin: this.#pinSchema.required(),
            desc: this.#descSchema,
        });
        return schema.validate(accountEntryDto);
    };

    validateTransferDto = (transferDto, currentUser) => {
        const schema = Joi.object({
            amount: this.#amountSchema.required(),
            dest_id: this.#idSchema
                .label('Destination account id')
                .invalid(currentUser.id)
                .required(),
                pin: this.#pinSchema.required(),
            desc: this.#descSchema,
        });
        return schema.validate(transferDto);
    };
}

module.exports = new AccountValidators();
