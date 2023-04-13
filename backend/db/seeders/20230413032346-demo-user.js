'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
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
   await queryInterface.bulkInsert('Users', [
    {
    email: 'demo1@demo.com',
    username: 'demoUser1',
    hashedPassword: bcrypt.hashSync('demoPassword1')
   },
   {
    email: 'demo2@demo.com',
    username: 'demoUser2',
    hashedPassword: bcrypt.hashSync('demoPassword2')
   },
   {
    email: 'demo3@demo.com',
    username: 'demoUser3',
    hashedPassword: bcrypt.hashSync('demoPassword3')
   },
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
