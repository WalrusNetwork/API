"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Ares", {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      kills: { type: Sequelize.INTEGER },
      deaths: { type: Sequelize.INTEGER },
      wools: { type: Sequelize.INTEGER },
      monuments: { type: Sequelize.INTEGER },
      cores: { type: Sequelize.INTEGER },
      hills: { type: Sequelize.INTEGER },
      flags: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Ares");
  },
};
