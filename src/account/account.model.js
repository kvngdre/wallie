import bcrypt from 'bcryptjs';
import objection, { Model } from 'objection';
import config from '../config/index.js';
import User from '../user/user.model.js';
import { operatorMap } from './utils/operator-map.utils.js';

class Account extends Model {
  static get tableName() {
    return 'accounts';
  }

  static get idColumn() {
    return 'id';
  }

  static modifiers = {
    /**
     * Filters accounts by balance if operator and balance is truthy.
     * @param {objection.QueryBuilder} query - The query builder object.
     * @param {AccountFilter} filter - The account filter object.
     */
    filterBalance(query, { operator, value }) {
      if (operator !== undefined && value !== undefined) {
        query.where('balance', operatorMap[operator], value);
      }
    },

    /**
     * Omits fields from account query.
     * @param {objection.QueryBuilder} query - The query builder object for the account table.
     * @param {(string|Array.<string>|undefined)} fieldsToOmit - The field name or array of field names to omit from the query result.
     */
    omitFields(query, fieldsToOmit) {
      if (fieldsToOmit && fieldsToOmit.length > 0) {
        // Convert the fieldsToOmit argument to an array if it is a string
        if (typeof fieldsToOmit === 'string') {
          fieldsToOmit = [fieldsToOmit];
        }
        // Get the list of all fields defined in the account schema
        const fields = Object.keys(Account.jsonSchema.properties);

        // Filter out the fields that are not in the fieldsToOmit array
        const fieldsToSelect = fields.filter(
          (field) => !fieldsToOmit.includes(field),
        );

        // Select only the filtered fields in the query
        query.select(fieldsToSelect);
      }
    },
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'pin'],
      properties: {
        id: { type: 'string' },
        user_id: { type: 'string' },
        pin: { type: 'string' },
        balance: { type: 'number' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    };
  }

  $beforeInsert() {
    /*
     * Hashing the pin property of the create account DTO.
     * This is to ensure that pins are stored securely in the database.
     */
    this.pin = bcrypt.hashSync(this.pin, parseInt(config.saltRounds));
  }

  $beforeUpdate() {
    // * Hashes the pin property of the account update DTO if it exists.
    if (this.hasOwnProperty('pin'))
      this.pin = bcrypt.hashSync(this.pin, parseInt(config.saltRounds));
  }

  /**
   * Returns a plain object representation of the account instance, omitting the pin field.
   * @returns {objection.Pojo}
   */
  toObject() {
    // Delete sensitive data.
    delete this.pin;
    return this;
  }

  /**
   * Validates the given pin against the stored pin hash.
   * @param {string} pin - The pin to validate.
   * @returns {boolean} True if the pin matches, false otherwise.
   */
  validatePin = (pin) => {
    return bcrypt.compareSync(pin, this.pin);
  };
}

export default Account;
