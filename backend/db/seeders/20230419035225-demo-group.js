'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options,[
      {
        organizerId: 1,
        name: 'group1',
        about: 'group 1 description',
        type: 'In Person',
        private: true,
        city: 'Greensboro',
        state: 'NC',
        previewImage: 'www.preview.com/image/1'
      },
      {
        organizerId: 2,
        name: 'group2',
        about: 'group 2 description',
        type: 'In Person',
        private: false,
        city: 'Owensboro',
        state: 'KY',
        previewImage: 'www.preview.com/image/2'
      },
      {
        organizerId: 3,
        name: 'group3',
        about: 'group 3 description',
        type: 'In Person',
        private: true,
        city: 'Chicago',
        state: 'IL',
        previewImage: 'www.preview.com/image/3'
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     name: { [Op.in]: ['group1', 'group2', 'group3'] }
      }, {});
  }
};
