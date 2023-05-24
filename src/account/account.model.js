import bcrypt from 'bcryptjs';
import { Model } from 'objection';
import config from '../config/index.js';

export default class Account extends Model {
  static get tableName() {
    return 'accounts';
  }

  static get idColumn() {
    return 'id';
  }

  $beforeInsert() {
    // ! Hash account pin before insert.
    this.pin = bcrypt.hashSync(this.pin, parseInt(config.saltRounds));
  }

  $beforeUpdate() {
    // ! Hash account pin before update.
    if (this.hasOwnProperty('pin'))
      this.pin = bcrypt.hashSync(this.pin, parseInt(config.saltRounds));
  }

  /**
   *
   * @returns {AccountDetails}
   */
  toObject() {
    delete this.pin;
    return this;
  }

  validatePin = (pin) => {
    return bcrypt.compareSync(pin, this.pin);
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
      },
    };
  }
}
