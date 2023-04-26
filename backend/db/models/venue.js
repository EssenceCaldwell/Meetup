'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(
        models.Event,
        {foreignKey: 'venueId', onDelete: 'CASCADE',  hooks: true}
      ),
      Venue.belongsTo(
        models.Group,
        {foreignKey: 'groupId'}
      )
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
       allowNull: false,
       validate:{
        isNotTooShort(val){
          if(!val.length){
            throw new Error('Street address is required')
          }
        }
       }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isNotTooShort(val){
          if(!val.length){
            throw new Error('City is required')
          }
        }
       }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isNotTooShort(val){
          if(!val.length){
            throw new Error('State is required')
          }
        }
       }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    defaultScope:{
      attributes:{
        exclude: [ 'createdAt', 'updatedAt']
      }
    },
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
