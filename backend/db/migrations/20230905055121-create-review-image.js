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
    await queryInterface.createTable('ReviewImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {   //Review1
          model: 'Reviews',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      url: {
        type: Sequelize.TEXT,
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
    options.tableName = "ReviewImages";  //added and changed
    await queryInterface.dropTable(options);
  }
};
