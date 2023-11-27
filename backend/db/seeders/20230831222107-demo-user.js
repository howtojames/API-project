'use strict';


const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
//--------------------------------------------

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([  //phase 3
      {
        firstName: 'John',   //added in phase 5
        lastName: 'Doe',
        email: 'demo@user.io',
        username: 'Demo-lition',    //this was passsed as credential in POST /api/session/ in phase 5
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jane',   //added in phase 5
        lastName: 'Dane',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Ryan',   //added in phase 5
        lastName: 'Hunington',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {   //added for testing and ease of use during spotdetail post review button
        firstName: 'James',
        lastName: 'Ruan',
        email: 'jruan@gmail.com',
        username: 'jruan',
        hashedPassword: bcrypt.hashSync('password123')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {  //bulkDelete needs options
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};

//phase 3
//In the seeder file, create a demo user with email, username, and hashedPassword fields. For the down function, delete the user with the username or email of the demo user.
//You should also define the schema name for the Postgres production database in the options object at the top of the file, and include the options object in both the up and down functions.
//If you'd like, you can also add other users and populate the fields with random fake data. To generate the hashedPassword you should use the bcryptjs package's hashSync method.
