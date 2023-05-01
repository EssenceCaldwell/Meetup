'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(
        models.User,
        {foreignKey: 'attendeeId'}
      );
      Attendance.belongsTo(
        models.Event,
        {foreignKey: 'eventId'}
      )
    }
  }
  Attendance.init({
    eventId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attendeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
