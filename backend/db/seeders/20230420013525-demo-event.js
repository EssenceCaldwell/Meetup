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
    await queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: "Voice Over Networking",
        description: "A great way to meet other voice actors and network!",
        type: "In person",
        capacity: 10,
        price: 50.0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-02"),
        previewImage: "https://i.imgur.com/s1jN3Tp.jpg",
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Mountian Lovers Meetup",
        description:
          "It's time mountain lovers! We shall meet and drink of the mountain's fresh spring!",
        type: "In person",
        capacity: 20,
        price: 100.0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-02"),
        previewImage: "https://i.imgur.com/td7pKHw.jpeg",
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Soulfame Lanch Party",
        description:
          "Online event! Come and celebrate the new SoulFrame launch!",
        type: "Online",
        capacity: 30,
        price: 150.0,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-02"),
        previewImage: "https://i.imgur.com/tIZDMdJ.jpg",
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     name: { [Op.in]: ['group1', 'group2', 'group3'] }
      }, {});
  }
};
