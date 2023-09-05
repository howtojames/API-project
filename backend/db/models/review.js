'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //Spot2
      Review.belongsTo(models.Spot, {
        foreignKey:'spotId',
      });

      //User3
      Review.belongsTo(models.User, {
        foreignKey:'userId',
      });


      //Review1
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
        hooks: 'true'
      });



    }
  }
  Review.init({
    id: {                       //because 2 foreignKeys
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    } //added allowNull to all
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
