import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
import refineValidationError from '../utils/refineValidationError.utils.js';

const JoiPassword = Joi.extend(joiPasswordExtendCore);

class UserValidator {
  #emailSchema;
  #nameSchema;
  #passwordSchema;

  constructor() {
    this.#emailSchema = Joi.string()
      .email()
      .lowercase()
      .label('Email')
      .max(100)
      .trim();

    this.#nameSchema = Joi.string().min(2).max(30).trim().messages({
      'string.min': 'Invalid {#label}',
      'string.max': '{#label} is too long',
      'any.required': '{#label} is required',
    });
    this.#passwordSchema = JoiPassword.string()
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
  }

  /**
   * Validates the sign up request payload and appends default key-values.
   * @param {*} dto
   * @returns {{ value: SignUpDto, error: (Object.<string, string>|undefined)}}
   */
  validateSignUp = (dto) => {
    const schema = Joi.object({
      id: Joi.string().default('').forbidden(),
      first_name: this.#nameSchema.label('First name').required(),
      last_name: this.#nameSchema.label('Last name').required(),
      email: this.#emailSchema.required(),
      password: this.#passwordSchema.required(),
      account: Joi.object({
        id: Joi.string().default('').forbidden(),
        user_id: Joi.string().default('').forbidden(),
        pin: Joi.string()
          .label('Pin')
          .trim()
          .required()
          .length(4)
          .pattern(/^\d{4}$/)
          .messages({
            'string.pattern.base':
              '{#label} is not valid. Must be a {#limit} digit number string.',
          }),
      }).required(),
    });

    let { value, error } = schema.validate(dto, { abortEarly: false });
    if (error !== undefined) error = refineValidationError(error);

    return { value, error };
  };

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
  };

  validateUserSignInDto = (user) => {
    const schema = Joi.object({
      email: this.#emailSchema.required(),
      password: Joi.string().label('Password').required(),
    });
    return schema.validate(user);
  };
}

export default UserValidator;
