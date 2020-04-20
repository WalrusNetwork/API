"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Groups", {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      name: { type: Sequelize.STRING },
      priority: { type: Sequelize.INTEGER },
      staff: { type: Sequelize.BOOLEAN },
      tag: { type: Sequelize.STRING },
      flair: { type: Sequelize.STRING },
      badge: { type: Sequelize.STRING },
      badge_color: { type: Sequelize.STRING },
      api_permissions: { type: Sequelize.ARRAY(Sequelize.STRING) },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Groups");
  },
};
