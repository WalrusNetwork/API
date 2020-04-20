"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn(
        "Ares", // name of Source model
        "wins", // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        }
      )
      .then(() => {
        return queryInterface.addColumn(
          "Ares", // name of Source model
          "losses", // name of the key we're adding
          {
            type: Sequelize.INTEGER,
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          }
        );
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn(
        "Ares", // name of Source model
        "wins" // name of the key we're adding
      )
      .then(() => {
        return queryInterface.removeColumn(
          "Ares", // name of Source model
          "losses" // name of the key we're adding
        );
      });
  },
};
