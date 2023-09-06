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
    await queryInterface.createTable('SpotImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {      //Spot3
            model: 'Spots',
            key: 'id'
        },
        onDelete: 'cascade'
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      preview: {
        type: Sequelize.BOOLEAN,
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
    }, options);  //added
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";  //added and changed
    await queryInterface.dropTable(options);
  }
};
