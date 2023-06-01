import { Model } from 'objection';
import User from '../user/user.model.js';

class Session extends Model {
  static tableName() {
    return 'sessions';
  }

  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'sessions.user_id',
          to: 'sessions.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'refresh_token'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    };
  }
}

export default Session;
