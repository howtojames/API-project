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
      {  //sandiego
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-998111382681410027/original/93535c00-e575-4b0d-acfb-77c74e14b5e1.jpeg?im_w=1200",
        preview: true
      },
      { //refactor for multiple previews
        spotId: 1,
        url: "https://random-image-url.com",
        preview: false  //from the documentation it only wants one previewImage url, beucase it doesn't have an array
      },
      {  //sandiego
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/680b1ede-b6d2-43d7-a562-48bc0a4f17d4.jpg?im_w=960",
        preview: true
      },
      {  //sandiego
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-33985367/original/5741c97b-db85-4b5b-b542-3e47d8336cd0.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-50862286/original/2ad177ab-a534-43d1-8ff0-31d61e8a8674.jpeg?im_w=1200",
        preview: true
      },
      {
        spotId: 5,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-552052652313287124/original/58450d5e-6b86-44bd-b896-817ad6725061.jpeg?im_w=1200",
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
