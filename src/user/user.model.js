import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Model } from 'objection';
import Account from '../account/account.model.js';
import config from '../config/index.js';

export default class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  $beforeInsert() {
    // ! Hash user password before insert.
    this.password = bcrypt.hashSync(this.password, parseInt(config.saltRounds));
  }

  $beforeUpdate() {
    // ! Hash account pin before update.
    if (this.hasOwnProperty('password'))
      this.password = bcrypt.hashSync(
        this.password,
        parseInt(config.saltRounds),
      );
  }

  static get relationMappings() {
    return {
      account: {
        relation: Model.HasOneRelation,
        modelClass: Account,
        join: {
          from: 'users.id',
          to: 'accounts.user_id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['first_name', 'last_name', 'email', 'username', 'password'],
      properties: {
        id: { type: 'string' },
        first_name: { type: 'string', minLength: 2, maxLength: 30 },
        last_name: { type: 'string', minLength: 2, maxLength: 30 },
        email: { type: 'string', maxLength: 255 },
        username: { type: 'string', maxLength: 10 },
        password: { type: 'string' },
      },
    };
  }

  /**
   *
   * @returns {UserProfile}
   */
  toObject() {
    delete this.password;
    return this;
  }

  ValidatePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
  };

  generateAccessToken() {
    return jwt.sign({ id: this.id }, config.jwt.secret, {
      audience: config.jwt.audience,
      expiresIn: parseInt(config.jwt.exp_time),
      issuer: config.jwt.issuer,
    });
  }
}
