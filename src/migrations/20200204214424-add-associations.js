"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn(
        "BlogPosts", // name of Source model
        "uuid", // name of the key we're adding
        {
          type: Sequelize.UUID,
          references: {
            model: "Users", // name of Target model
            key: "uuid", // key in Target model that we're referencing
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        }
      )
      .then(() => {
        return queryInterface
          .addColumn(
            "BlogPostContents", // name of Source model
            "blogpostId", // name of the key we're adding
            {
              type: Sequelize.INTEGER,
              references: {
                model: "BlogPosts", // name of Target model
                key: "id", // key in Target model that we're referencing
              },
              onUpdate: "CASCADE",
              onDelete: "SET NULL",
            }
          )
          .then(() => {
            return queryInterface
              .addColumn(
                "Ares", // name of Source model
                "uuid", // name of the key we're adding
                {
                  type: Sequelize.UUID,
                  references: {
                    model: "Users", // name of Target model
                    key: "uuid", // key in Target model that we're referencing
                  },
                  onUpdate: "CASCADE",
                  onDelete: "SET NULL",
                }
              )
              .then(() => {
                return queryInterface.addColumn(
                  "Permissions", // name of Source model
                  "groupId", // name of the key we're adding
                  {
                    type: Sequelize.INTEGER,
                    references: {
                      model: "Groups", // name of Target model
                      key: "id", // key in Target model that we're referencing
                    },
                    onUpdate: "CASCADE",
                    onDelete: "SET NULL",
                  }
                );
              });
          });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn(
        "BlogPosts", // name of Source model
        "uuid" // key we want to remove
      )
      .then(() => {
        return queryInterface
          .removeColumn(
            "BlogPostContents", // name of Source model
            "blogpostId" // key we want to remove
          )
          .then(() => {
            return queryInterface
              .removeColumn(
                "Ares", // name of Source model
                "uuid" // key we want to remove
              )
              .then(() => {
                return queryInterface.removeColumn(
                  "Groups", // name of Source model
                  "groupId" // key we want to remove
                );
              });
          });
      });
  },
};
