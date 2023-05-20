const { Model } = require('objection');
const bcrypt = require('bcryptjs');
const NotFoundException = require('../errors/notFound.error');

class Account extends Model {
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

  static createNotFoundError(queryContext, message) {
    return new NotFoundException(message);
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

module.exports = Account;
