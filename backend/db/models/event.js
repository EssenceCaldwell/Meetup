'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes, Validator) => {
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
        {through: models.Attendance, foreignKey: 'userId'}
      ),
      Event.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId', onDelete: 'CASCADE',  hooks: true ,
          constraints: false,
          scope: {
            imageableType: 'Events'
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
      ),
      Event.hasMany(
        models.Attendance,
        {foreignKey: 'eventId', onDelete: 'CASCADE',  hooks: true}
      )
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
      ,
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate:{
        isInFuture(val){
          if(new Date(val) < new Date){
            throw new Error ('Start date must be in the future')
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate:{
        isInFuture(val){
          if(new Date(val) < this.startDate){
            throw new Error ('End date is less than start date')
          }
        }
      }
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: true
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
