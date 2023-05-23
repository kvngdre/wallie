import { Model } from 'sequelize';

function userModelGenerator(sequelize, DataTypes) {
  class UserModel extends Model {
    /*
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     */
    static associate(models) {
      UserModel.hasOne(models.Account, {
        foreignKey: {
          type: DataTypes.UUID,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  UserModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
    },
  );

  return UserModel;
}

export default userModelGenerator;
