'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(
        models.User,
        {through: models.Membership}
      ),
      Group.belongsTo(
        models.User,
        {foreignKey: 'organizerId'}
      ),
      Group.hasMany(
        models.Event,
        {foreignKey: 'groupId', onDelete: 'CASCADE',  hooks: true }
      ),
      Group.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId', onDelete: 'CASCADE',  hooks: true ,
          constraints: false,
          scope: {
            imageableType: 'Group'
          }
        }
      ),
      Group.belongsTo(
        models.Venue,
        {foreignKey: 'groupId'}
      )
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
       allowNull: false,
       validate: {
        len: [2, 60],
        isNotTooLong(val){
          if(val.length > 60){
            throw new Error ('Name must be 60 characters or less')
          }
        }
       }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 200],
        isNotTooShort(val){
          if(val.length < 60){
            throw new Error('About must be 50 characters or more')
          }
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Online', 'In Person']],
        isCorrectVal(val){
          if(val === 'Online' || 'In Person'){
            throw new Error("Type must be 'Online' or 'In person'")
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isBoolean(val){
          if(val === true || false){
            throw new Error('Private must be a boolean')
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isNotEmpty(val){
          if(!val.length){
            throw new Error('City is required')
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNotEmpty(val){
          if(!val.length){
            throw new Error('State is required')
          }
        }
      }
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
