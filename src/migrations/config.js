"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert("SequelizeMeta", [
        {
          name: "config.js",
        },
      ])
      .then(() => {
        return queryInterface.bulkDelete("SequelizeMeta", [
          {
            name: "config.js",
          },
        ]);
      });
  },

  down: (queryInterface, Sequelize) => {
    return console.log("Something has gone wrong migrating a config file");
  },

  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },

  PRODUCTION: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
};
