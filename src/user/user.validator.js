import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
import { v4 as uuidv4 } from 'uuid';
import refineValidationError from '../utils/refineValidationError.utils.js';
import { uuidToBin } from '../utils/uuidConverter.utils.js';

const JoiPassword = Joi.extend(joiPasswordExtendCore);

class UserValidator {
  #emailSchema;
  #nameSchema;
  #passwordSchema;
  #usernameSchema;

  constructor() {
    this.#emailSchema = Joi.string()
      .email()
      .lowercase()
      .label('Email')
      .max(100)
      .trim();

    this.#nameSchema = Joi.string().lowercase().min(2).max(30).trim().messages({
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

    this.#usernameSchema = Joi.string()
      .label('Username')
      .lowercase()
      .trim()
      .min(3)
      .max(10)
      .pattern(/^[a-z_]+[a-z0-9_]*$/)
      .pattern(/^\d/, { invert: true })
      .messages({
        'string.pattern.invert.base': '{#label} can not begin with a number',
        'string.pattern.base':
          '{#label} can only contain letters, numbers, and underscore characters',
        'string.min': '{#label} must be at least {#limit} characters long',
        'string.max':
          '{#label} must be less than or equal to {#limit} characters long',
      });
  }

  /**
   * Validates the sign up request payload and appends default key-values.
   * @param {*} dto
   * @returns {{ value: SignUpDto, error: (Object.<string, string>|undefined)}}
   */
  validateSignUp = (dto) => {
    const schema = Joi.object({
      user: Joi.object({
        id: Joi.string().default('').forbidden(),
        first_name: this.#nameSchema.label('First name').required(),
        last_name: this.#nameSchema.label('Last name').required(),
        email: this.#emailSchema.required(),
        username: this.#usernameSchema.required(),
        password: this.#passwordSchema.required(),
      }).required(),
      account: Joi.object({
        id: Joi.string().default('').forbidden(),
        user_id: Joi.string().default('').forbidden(),
        pin: Joi.string()
          .label('Pin')
          .trim()
          .required()
          .length(4)
          .pattern(/^\d+$/)
          .messages({
            'string.pattern.base': '{#label} is not valid. Must be a number',
            'string.length': '{#label} must be {#limit} digits long',
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
