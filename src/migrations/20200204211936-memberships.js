"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Memberships", {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      uuid: { type: Sequelize.UUID, primaryKey: true },
      groupId: { type: Sequelize.INTEGER, primaryKey: true },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Memberships");
  },
};
