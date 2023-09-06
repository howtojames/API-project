'use strict';
/** @type {import('sequelize-cli').Migration} */

//added
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
//--------------------------------------------

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,   //Review1  //for associations
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {  //Spot2
          model: 'Spots',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {  //User3
          model: 'Users',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stars: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    }, options); //added
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";  //added and changed
    await queryInterface.dropTable(options);
  }
};
