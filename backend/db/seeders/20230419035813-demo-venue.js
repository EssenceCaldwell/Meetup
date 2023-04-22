'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options,[
      {
        groupId: 1,
        address: '123 Address Rd',
        city: 'Greensboro',
        state: 'NC',
        lat: 123.321,
        lng: 456.654
      },
      {
        groupId: 2,
        address: '456 Address Rd',
        city: 'Owensboro',
        state: 'KY',
        lat: 789.987,
        lng: 321.123
      },
      {
        groupId: 3,
        address: '789 Address Rd',
        city: 'Chicago',
        state: 'IL',
        lat: 654.456,
        lng: 987.789
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     city: { [Op.in]: ['Greensboro', 'Owensboro', 'Chicago'] }
      }, {});
  }
};
