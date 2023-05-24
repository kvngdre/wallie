import { Model } from 'sequelize';
import {
  TransactionPurpose,
  TransactionType,
} from './jsdoc/transaction.types.js';

/**
 * @type {import('../db/jsdoc/db.types.js').ModelGenerator}
 */
function transactionModelGenerator(sequelize, DataTypes) {
  class TransactionModel extends Model {
    /*
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
      TransactionModel.belongsTo(models.Account);
    }
  }

  TransactionModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      account_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM(Object.values(TransactionType)),
        allowNull: false,
      },

      purpose: {
        type: DataTypes.ENUM(Object.values(TransactionPurpose)),
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(20, 4).UNSIGNED,
        allowNull: false,
      },

      reference: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },

      balance_before: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: false,
      },

      balance_after: {
        type: DataTypes.DECIMAL(20, 4),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      underscored: true,
    },
  );

  return TransactionModel;
}

export default transactionModelGenerator;
