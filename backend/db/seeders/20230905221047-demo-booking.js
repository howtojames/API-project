'use strict';


const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
//--------------------------------------------

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-09-15'),
        endDate: new Date('2023-09-25'),
      },
      {
        spotId: 2,                          //user 1 has two spots
        userId: 1,
        startDate: new Date('2023-09-26'),
        endDate: new Date('2023-09-30'),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2023-09-25'),
        endDate: new Date('2023-10-5')
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2023-11-13'),
        endDate: new Date('2023-11-15')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';  //changed here
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {  //bulkDelete needs options
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
