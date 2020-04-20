"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Permissions", {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      realm: { type: Sequelize.STRING },
      value: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Permissions");
  },
};
