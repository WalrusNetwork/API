"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .renameColumn("Groups", "api_permissions", "apiPermissions")
      .then(() => {
        return queryInterface.renameColumn(
          "Users",
          "verification_token",
          "verificationToken"
        );
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .renameColumn("Groups", "apiPermissions", "api_permissions")
      .then(() => {
        return queryInterface.renameColumn(
          "Users",
          "verificationToken",
          "verification_token"
        );
      });
  },
};
