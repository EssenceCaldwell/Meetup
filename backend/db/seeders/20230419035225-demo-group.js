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
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "Voice Life",
        about:
          "A great group to join if you are intersted in the voiceover world! If you are interested in joining the industry, we meet and network regularly.",
        type: "In Person",
        private: true,
        city: "Greensboro",
        state: "NC",
        previewImage: "https://i.imgur.com/s1jN3Tp.jpg",
      },
      {
        organizerId: 2,
        name: "Mountain Lovers",
        about:
          "Do you love mountains? Does just talking about mountain make you want to cry tears of joy? Come join our Mountain Lovers Event! We will talk about mountains and even drink fresh mountain water! Hill lovers not allowed.",
        type: "In Person",
        private: false,
        city: "Owensboro",
        state: "KY",
        previewImage: "https://i.imgur.com/td7pKHw.jpeg",
      },
      {
        organizerId: 3,
        name: "Gamers Unite!",
        about:
          "Join our group to be up to date on all the latest releases on Xbox, PS5 and Switch. Everyone welcome!",
        type: "Online",
        private: true,
        city: "Chicago",
        state: "IL",
        previewImage: "https://i.imgur.com/pfbsrZb.jpeg",
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     name: { [Op.in]: ['group1', 'group2', 'group3'] }
      }, {});
  }
};
