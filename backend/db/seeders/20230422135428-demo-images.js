'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  options.tableName = 'Images';
  await queryInterface.bulkInsert(options, [
    {
      imageableId: 1,
      imageableType: 'Groups',
      url: 'https://i.imgur.com/n6EhKh1.jpeg',
      preview: true
    },
    {
      imageableId: 2,
      imageableType: 'Groups',
      url: 'https://i.imgur.com/eje1odU.jpeg',
      preview: true
    },
    {
      imageableId: 3,
      imageableType: 'Groups',
      url: 'https://i.imgur.com/YTJAbHG.jpeg',
      preview: true
    },
    {
      imageableId: 1,
      imageableType: 'Events',
      url: 'https://i.imgur.com/Pieimca.jpeg',
      preview: true
    },
    {
      imageableId: 2,
      imageableType: 'Events',
      url: 'https://i.imgur.com/dRl0mKZ.jpeg',
      preview: true
    },
    {
      imageableId: 3,
      imageableType: 'Events',
      url: 'https://i.imgur.com/pJWMB.jpeg',
      preview: true
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Images'
    await queryInterface.bulkDelete(options, null, {})
  }
};
