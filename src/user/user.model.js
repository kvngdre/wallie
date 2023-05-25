import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import objection, { Model } from 'objection';
import Account from '../account/account.model.js';
import config from '../config/index.js';

export default class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
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

  static modifiers = {
    /**
     * Filters users by email if email is truthy.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {string} email - The email to filter by.
     */
    filterEmail(query, email) {
      if (email) {
        query.andWhere('email', 'like', `%${email}%`);
      }
    },

    /**
     * Filters users by first or last name if name is truthy.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {string} name - The name to filter by.
     */
    filterName(query, name) {
      if (name) {
        query.where(function () {
          this.where('first_name', 'like', `%${name}%`).orWhere(
            'last_name',
            'like',
            `%${name}%`,
          );
        });
      }
    },

    /**
     * Filters users by username if username is truthy.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {string} username - The username to filter by.
     */
    filterUsername(query, username) {
      if (username) {
        query.andWhere('username', 'like', `%${username}%`);
      }
    },

    /**
     * Omits fields from users.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {(string|Array.<string>)} fieldsToOmit - Field or array of fields to omit.
     */
    omitFields(query, fieldsToOmit) {
      if (typeof fieldsToOmit === 'string') {
        fieldsToOmit = [fieldsToOmit];
      }

      const fields = Object.keys(User.jsonSchema.properties);
      const fieldsToSelect = fields.filter(
        (field) => !fieldsToOmit.includes(field),
      );

      query.select(fieldsToSelect);
    },
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['first_name', 'last_name', 'email', 'username', 'password'],
      properties: {
        id: { type: 'string' },
        first_name: { type: 'string', minLength: 2, maxLength: 30 },
        last_name: { type: 'string', minLength: 2, maxLength: 30 },
        email: { type: 'string', maxLength: 50 },
        username: { type: 'string', maxLength: 10 },
        password: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    };
  }

  $beforeInsert() {
    /*
     * Hashing the password property of the create user DTO.
     * This is to ensure that passwords are stored securely in the database.
     */
    this.password = bcrypt.hashSync(this.password, parseInt(config.saltRounds));
  }

  $beforeUpdate() {
    // * Hashes the password property of the user update DTO if it exists.
    if (this.hasOwnProperty('password'))
      this.password = bcrypt.hashSync(
        this.password,
        parseInt(config.saltRounds),
      );
  }

  generateAccessToken() {
    return jwt.sign({ id: this.id }, config.jwt.secret, {
      audience: config.jwt.audience,
      expiresIn: parseInt(config.jwt.exp_time),
      issuer: config.jwt.issuer,
    });
  }

  /**
   * Returns a plain object representation of the user instance, omitting the password field.
   * @returns {objection.Pojo}
   */
  toObject() {
    // Delete sensitive data.
    delete this.password;

    return this.toJSON();
  }

  ValidatePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
  };
}
