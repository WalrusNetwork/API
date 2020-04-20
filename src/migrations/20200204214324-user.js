"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      uuid: { primaryKey: true, type: Sequelize.UUID },
      username: { type: Sequelize.STRING },
      usernameAcquisitionDate: { type: Sequelize.DATE },
      registered: { type: Sequelize.BOOLEAN },
      count: { type: Sequelize.INTEGER },
      email: { type: Sequelize.STRING, validate: { isEmail: true } },
      password: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  },
};
