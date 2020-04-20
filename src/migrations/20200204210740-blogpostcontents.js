"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("BlogPostContents", {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      locale: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING },
      content: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("BlogPostContents");
  },
};
