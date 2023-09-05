'use strict';

//--------------------------------------------
const { Spot } = require('../models');
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

    //id's will automatically generate
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "1747 India St",  //near
        city: "San Diego",
        state: "CA",
        country: "United States",
        lat: 32.723490,
        lng: -117.168070,
        name: "Stylish Modern Loft in the Heart of Little Italy",
        description: "Stylish Modern Loft In The Heart Little Italy. Experience What It's Like to Live In One Of The Most Popular Neighborhoods In San Diego For A Few Days. Exposed Brick, High Ceilings, Lofted Bed, Beautiful Art & Open Floor Plan.",
        price: 140
      },
      {
        ownerId: 1,
        address: "645 Market St",
        city: "San Diego",
        state: "CA",
        country: "United States",
        lat: 32.723490,
        lng: -117.168070,
        name: "Charlie's Private Guest House",
        description: "Relax with the whole family at this peaceful place to stay. Beautiful guest house with private bath located in the peaceful neighborhood of North Clairemont. ",
        price: 80,
      },
      {
        ownerId: 1,
        address: "256 Ocean View Ave",
        city: "San Diego",
        state: "CA",
        country: "United States",
        lat: 32.723900,
        lng: -117.168500,
        name: "Sunny San Diego Retreat",
        description: "Enjoy the sunny weather and beach vibes at this lovely retreat in San Diego. This cozy apartment is just a short drive from the beautiful beaches and vibrant downtown.",
        price: 150
      },
      {
        ownerId: 2,
        address: "213 Main Street",
        city: "Mountain View",
        state: "CA",
        country: "United States",
        lat: 37.3897,
        lng: -122.0817,
        name: "Luxury Condo near Giants & Stanford Tech",
        description: "700 Sq foot | 72 Sq meters FULLY FURNISHED Modern 1 bedroom 1 bathroom luxury condo in an ultra-modern building, featuring resort-style amenities and all the essential conveniences. ",
        price: 249,
      },
      {
        ownerId: 2,
        address: "543 Elm Avenue",
        city: "Mountain View",
        state: "CA",
        country: "United States",
        lat: 37.4230,
        lng: -122.1027,
        name: "This bright & sunny guesthouse is located in a quiet neighborhood in the heart of Palo Alto; close to Stanford, Alphabet, Meta, Apple. ",
        description: "Guesthouse @ Serene Neighborhood",
        price: 168,
      }  //5 spots in total
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';  //changed
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2]}
    }, {});
  }
};


//spend too long on this, check for any potential errors
