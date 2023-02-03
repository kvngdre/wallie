const { Model } = require('objection');
const bcrypt = require('bcrypt');
const NotFoundException = require('../errors/NotFoundError');

class Account extends Model {
    static get tableName() {
        return 'accounts';
    }

    $beforeInsert() {
        // Hash user password before insert.
        this.pin = bcrypt.hashSync(this.pin, 10);
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