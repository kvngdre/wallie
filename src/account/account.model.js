import bcrypt from 'bcryptjs';
import { Model } from 'objection';

export default class Account extends Model {
  static get tableName() {
    return 'accounts';
  }

  $beforeInsert() {
    // Hash account pin before insert.
    this.pin = bcrypt.hashSync(this.pin, 10);
  }

  $beforeUpdate() {
    // Hash account pin before update.
    if (this.hasOwnProperty('pin')) this.pin = bcrypt.hashSync(this.pin, 10);
  }

  omitPin = () => delete this.pin;

  comparePins = (pin) => {
    return bcrypt.compareSync(pin, this.pin);
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'pin'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        pin: { type: 'string' },
        balance: { type: 'number' },
      },
    };
  }
}
