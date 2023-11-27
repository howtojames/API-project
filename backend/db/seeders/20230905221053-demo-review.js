'use strict';

const { Review } = require('../models');

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
    await Review.bulkCreate([   //spotId and userId must align with bookings, or have less
      {
        spotId:1,
        userId:1,             //userId 1 has two spots
        review: "Great experience staying at this spot. Highly recommend!",
        stars: 5,
      },
      {
        spotId:1,
        userId:2,
        review: "Example review for spotId 1.",
        stars: 4,
      },
      {     //own user review, added user 4 at the same time
        spotId:1,
        userId:4,
        review: "Review from James.",
        stars: 5,
      },

      {
        spotId:2,
        userId:1,
        review: "Had a wonderful time at this spot. Clean and comfortable. Only complaint was that there was no air conditioning.",
        stars: 4
      },
      {
        spotId: 2,    //this is the 3rd review
        userId: 2,
        review: "Enjoyed my stay here. Nice spot with good amenities.",
        stars: 4
      },

      {
        spotId:3,
        userId:1,
        review: "First review for Spot 3.",
        stars: 4
      },


      //userId 3 does not have a review
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {  //bulkDelete needs options
      userId: { [Op.in]: [1, 2] }  //change this if you're adding more seeds
    }, {});
  }
};
