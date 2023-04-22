'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options,[
      {
        venueId: 1,
        groupId: 1,
        name: 'group1',
        description: 'group 1 description',
        type: 'In person',
        capacity: 10,
        price: 50.00,
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        previewImage: 'www.preview.com/image/1'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'group2',
        description: 'group 2 description',
        type: 'In person',
        capacity: 20,
        price: 100.00,
        startDate: '2024-02-01',
        endDate: '2024-02-01',
        previewImage: 'www.preview.com/image/2'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'group3',
        description: 'group 3 description',
        type: 'In person',
        capacity: 30,
        price: 150.00,
        startDate: '2024-03-01',
        endDate: '2024-03-02',
        previewImage: 'www.preview.com/image/3'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     name: { [Op.in]: ['group1', 'group2', 'group3'] }
      }, {});
  }
};
