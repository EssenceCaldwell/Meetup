'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes, Validator) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(
        models.Event,
        {through: models.Attendance, foreignKey: 'userId'}
      ),
      User.belongsToMany(
        models.Group,
        {through: models.Membership, foreignKey: 'memberId'}
      ),
      User.hasMany(
        models.Group,
        {foreignKey: 'organizerId', onDelete: 'CASCADE',  hooks: true }
      ),
      User.hasMany(
        models.Membership,
        {foreignKey: 'memberId', onDelete: 'CASCADE',  hooks: true}
      ),
      User.hasMany(
        models.Attendance,
        {foreignKey: 'userId', onDelete: 'CASCADE',  hooks: true}
      )
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30]
        }
      },
      firstName:{
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      defaultScope: {
        attributes:{
          exclude: ['hashedPassword', 'createdAt', 'updatedAt']
        }
      },
      sequelize,
      modelName: 'User'
    }
  );
  return User;
};
