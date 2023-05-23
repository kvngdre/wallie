import { Model } from 'sequelize';

/** @type {import('../db/jsdoc/db.types.js').ModelGenerator<Account>} */
function accountModelGenerator(sequelize, DataTypes) {
  class AccountModel extends Model {
    /*
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
      AccountModel.belongsTo(models.User);
    }
  }

  AccountModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },

      pin: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      balance: {
        type: DataTypes.DECIMAL(20, 4).UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Account',
      underscored: true,
    },
  );

  return AccountModel;
}

export default accountModelGenerator;
