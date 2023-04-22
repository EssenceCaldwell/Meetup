'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(
        models.Event,
        {through: models.Attendance, foreignKey: 'attendeeId'}
      ),
      User.belongsToMany(
        models.Group,
        {through: models.Membership, foreignKey: 'memberId'}
      ),
      User.hasMany(
        models.Group,
        {foreignKey: 'organizerId', onDelete: 'CASCADE',  hooks: true }
      )
    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      firstName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          isName(val){
            if(!val.lenght){
              throw new Error('First Name is required')
            }
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        isName(val){
          if(!val.length){
            throw new Error('Last Name is required')
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true,
          mustBeEmail(val){
            if(!Validator.isEmail(val)){
              throw new Error('Invalid email')
            }
          },
          requireEmail(val){
            if(!val.length){
              throw new Error('Email is required')
            }
          }
        }
      },
      password: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
          requirePassword(val){
            if(!val.length){
              throw new Error('Password is required')
            }
          }
        }
      }
    }, {
      sequelize,
      modelName: 'User'
    }
  );
  return User;
};
