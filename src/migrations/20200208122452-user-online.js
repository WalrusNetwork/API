"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Users", // name of Source model
      "online", // name of the key we're adding
      {
        type: Sequelize.BOOLEAN,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "Users", // name of Source model
      "online" // name of the key we're adding
    );
  },
};
