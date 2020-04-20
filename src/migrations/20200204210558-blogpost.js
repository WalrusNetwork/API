"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("BlogPosts", {
      id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true },
      slug: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("BlogPosts");
  },
};
