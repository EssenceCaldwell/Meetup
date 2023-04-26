'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(
        models.User,
        {through: models.Attendance, foreignKey: 'attendeeId'}
      ),
      Event.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId', onDelete: 'CASCADE',  hooks: true,
          constraints: false,
          scope:{
            imageableType: 'Event'
          }
        }
      ),
      Event.belongsTo(
        models.Venue,
        {foreignKey: 'venueId'}
      ),
      Event.belongsTo(
        models.Group,
        {foreignKey: 'groupId'}
      )
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 20],
        isNotTooShort(val){
          if(val.length < 5){
            throw new Error('Name must be at least 5 characters')
          }
        }
      }
    }
      ,
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNotEmpty(val){
          if(!val.length){
            throw new Error('Description is required')
          }
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCorrectVal(val){
          if(val === 'Online' || 'In Person'){
            throw new Error("Type must be 'Online' or 'In person'")
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        isInteger(val){
          if(!Validator.isInt(val)){
            throw new Error('Capacity must be an integer')
          }
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate:{
        len: [4,4],
        notAcceptable(val){
          if(!val.length === 4){
            throw new Error('Price is invalid')
          }
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    defaultScope:{
      attributes:{
        exclude: ['createdAt', 'updatedAt']
      }
    },
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
