"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("Groups", "badgeTextColor", {
        type: Sequelize.STRING,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      })
      .then(() => {
        return queryInterface.renameColumn(
          "Groups",
          "badge_color",
          "badgeColor"
        );
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Groups", "badgeTextColor").then(() => {
      return queryInterface.renameColumn("Groups", "badgeColor", "badge_color");
    });
  },
};
