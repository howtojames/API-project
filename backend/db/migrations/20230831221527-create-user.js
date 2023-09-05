'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,    //User1  //User2  //User3  //for associations
        type: Sequelize.INTEGER
      },
      firstName: {   //added in phase 5
        type: Sequelize.TEXT,
        allowNull: false   //no unique
      },
      lastName: {    //added in phase 5
        type: Sequelize.TEXT,
        allowNull: false   // no unique
      },
      username: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.TEXT,  //changed first four from string to text
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.dropTable(options);
  }
};


//define the schema name for the Postgres production database in the options object at the top of the file,
//and include the options object in both the up and down functions.
//All queryInterface method calls except createTable will require the options object as the first argument, with the appropriate tableName property.
