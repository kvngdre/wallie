import { Model } from 'objection';
import User from '../user/user.model.js';

class Token extends Model {
  static tableName() {
    return 'tokens';
  }

  static idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tokens.user_id',
          to: 'tokens.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'token', 'type'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'string' },
        token: { type: 'string' },
        type: { type: 'string' },
        expiration_time: { type: 'integer' },
        is_used: { type: 'boolean' },
        used_at: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    };
  }
}

export default Token;
