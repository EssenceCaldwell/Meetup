'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
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
   options.tableName = 'Memberships';
   await queryInterface.bulkInsert(options, [
    {
      groupId: 1,
      memberId: 1,
      status: 'member',
    },
    {
      groupId: 2,
      memberId: 2,
      status: 'member',
    },
    {
      groupId: 3,
      memberId: 3,
      status: 'member',
    },
    { groupId: 1,
      memberId: 2,
      status: 'pending'
    },
    {
      groupId: 2,
      memberId: 3,
      status: 'pending'
    },
    {
      groupId: 3,
      memberId: 1,
      status: "co-host"
    }
   ])
  },

  async down (queryInterface, Sequelize) {
      options.tableName = 'Memberships';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
       groupId: { [Op.in]: [1, 2, 3] }
        }, {});
  }
};
