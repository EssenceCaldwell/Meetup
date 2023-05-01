'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Attendances'
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        attendeeId: 1,
        status: 'member'
      },
      {
        eventId: 2,
        attendeeId: 2,
        status: 'member'
      },
      {
        eventId: 3,
        attendeeId: 3,
        status: 'member'
      },
      {
        eventId: 1,
        attendeeId: 2,
        status: 'pending'
      },
      {
        eventId: 2,
        attendeeId: 3,
        status: 'pending'
      },
      {
        eventId: 3,
        attendeeId: 1,
        status: 'pending'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     *
     */
    options.tableName = 'Attendance'
    await queryInterface.bulkDelete(options, null, {})
  }
};