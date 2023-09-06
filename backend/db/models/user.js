'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here


      //User1
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',   //checked
        onDelete: 'CASCADE',
        hooks: 'true'
      });


      //User2
      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: 'true'
      });


      //User3
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: 'true'
      });



    }
  };

  User.init(
    {
      firstName: {   //added in phase 5
        type: DataTypes.TEXT,
        allowNull: false   //no unique
      },
      lastName: {    //added in phase 5
        type: DataTypes.TEXT,
        allowNull: false   // no unique
      },
      username: {
        type: DataTypes.TEXT,
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
      email: {
        type: DataTypes.TEXT,
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
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {  //added in phase 3 -
        attributes: {  //exclude for user security, can only show username and id
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
