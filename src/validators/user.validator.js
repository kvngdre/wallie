const { joiPasswordExtendCore } = require('joi-password');
const Joi = require('joi');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const formatMsg = require('../utils/formatMsg');

class UserValidator {
    #nameSchema = Joi.string().min(2).max(30).trim().messages({
        'string.min': 'Invalid {#label}',
        'string.max': '{#label} is too long',
        'any.required': '{#label} is required',
    });

    #emailSchema = Joi
        .string()
        .email()
        .lowercase()
        .label('Email')
        .max(50)
        .trim();

    #passwordSchema = joiPassword
        .string()
        .label('Password')
        .minOfUppercase(1)
        .minOfSpecialCharacters(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .min(6)
        .max(1024)
        .messages({
            'password.minOfUppercase':
                '{#label} should contain at least {#min} uppercase character',
            'password.minOfSpecialCharacters':
                '{#label} should contain at least {#min} special character',
            'password.minOfNumeric':
                '{#label} should contain at least {#min} number',
            'password.noWhiteSpaces': '{#label} cannot contain white spaces',
        });

    validateNewUserDto = (user) => {
        const schema = Joi.object({
            first_name: this.#nameSchema.label('First name').required(),
            last_name: this.#nameSchema.label('Last name').required(),
            email: this.#emailSchema.required(),
            password: this.#passwordSchema.required(),
        });

        return schema.validate(user);
    };

    validateUpdateUserDto = (user) => {
        const schema = Joi.object({
            first_name: this.#nameSchema.label('First name'),
            last_name: this.#nameSchema.label('Last name'),
        });
        return schema.validate(user);
    }

    validateLogin = (user) => {
        const schema = Joi.object({
            email: this.#emailSchema.required(),
            password: Joi.string().label('Password').required(),
        });
        return schema.validate(user);
    }
}

module.exports = new UserValidator();
