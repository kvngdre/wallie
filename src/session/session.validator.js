import Joi from 'joi';
import { refineValidationError } from '../helpers/validation.helpers.js';
class SessionValidator {
  #emailSchema;
  #usernameSchema;

  constructor() {
    this.#emailSchema = Joi.string()
      .email()
      .trim()
      .lowercase()
      .label('Email')
      .max(50);

    this.#usernameSchema = Joi.string().label('Username').trim().min(3).max(20);
  }

  /** @type {ValidationFunction<LoginDto>} */
  validateLogin = (user) => {
    const schema = Joi.object({
      usernameOrEmail: Joi.alternatives()
        .try(this.#emailSchema.required(), this.#usernameSchema.required())
        .required(),
      password: Joi.string().label('Password').required(),
    });

    let { value, error } = schema.validate(user);
    if (error) error = refineValidationError();

    return { value, error };
  };
}

export default SessionValidator;
