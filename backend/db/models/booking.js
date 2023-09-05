'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Spot1
      Booking.belongsTo(models.Spot, {
        foreignKey:'spotId',
      });

      //User2
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
      })


    }
  }
  Booking.init({
    id: {                       //because 2 foreignKeys
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,         //need this
      type: DataTypes.INTEGER  //DataTypes
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }  //added allowNull to all
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
