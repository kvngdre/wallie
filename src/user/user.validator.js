import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
import refineValidationError from '../utils/refineValidationError.utils.js';

const JoiPassword = Joi.extend(joiPasswordExtendCore);

class UserValidator {
  #emailSchema;
  #emailFilterSchema;
  #nameSchema;
  #nameFilterSchema;
  #passwordSchema;
  #usernameSchema;
  #usernameFilterSchema;

  constructor() {
    this.#emailSchema = Joi.string()
      .email()
      .trim()
      .lowercase()
      .label('Email')
      .max(50);

    this.#emailFilterSchema = Joi.string().trim().lowercase().max(50).allow('');

    this.#nameSchema = Joi.string().lowercase().min(2).max(30).trim().messages({
      'string.min': 'Invalid {#label}',
      'string.max': '{#label} is too long',
      'any.required': '{#label} is required',
    });

    this.#nameFilterSchema = Joi.string()
      .label('Name')
      .lowercase()
      .trim()
      .max(30)
      .allow('');

    this.#passwordSchema = JoiPassword.string()
      .label('Password')
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .min(6)
      .max(255)
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

    this.#usernameFilterSchema = Joi.string()
      .lowercase()
      .trim()
      .max(10)
      .allow('');
  }

  /**@type {ValidationFunction<SignUpDto>} */
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
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<CreateUserDto>} */
  validateCreateUser = (dto) => {
    const schema = Joi.object({
      first_name: this.#nameSchema.label('First name').required(),
      last_name: this.#nameSchema.label('Last name').required(),
      email: this.#emailSchema.required(),
      username: this.#usernameSchema.required(),
      password: this.#passwordSchema.required(),
    });

    let { value, error } = schema.validate(dto, { abortEarly: false });
    if (error) error = refineValidationError(error);

    return { value, error };
  };

  /** @type {ValidationFunction<UserFilter>} */
  validateUserFilter = (dto) => {
    const schema = Joi.object({
      name: this.#nameFilterSchema,
      email: this.#emailFilterSchema,
      username: this.#usernameFilterSchema,
    });

    let { value, error } = schema.validate(dto, { abortEarly: false });
    if (error) error = refineValidationError(error);

    return { value, error };
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
