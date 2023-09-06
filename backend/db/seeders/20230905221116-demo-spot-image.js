'use strict';


const { SpotImage } = require('../models');  //import model accodingly

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
    await SpotImage.bulkCreate([   //based on Spots
      {
        spotId: 1,
        url: "https://airbnb.com/spot1_image1.jpg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://airbnb.com/spot1_image2.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://airbnb.com/spot2_image1.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://airbnb.com/spot3_image1.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://airbnb.com/spot4_image1.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://airbnb.com/spot5_image1.jpg",
        preview: true
      }  //we only have 5 spots in total, so spotId range from 1-5
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {  //bulkDelete needs options
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
