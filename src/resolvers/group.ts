import User from "../models/user";
import Group from "../models/group";
import Permissions from "../models/permissions";

export default {
  Query: {
    groups(parent, args, context, info) {
      if (args.id) {
        return [Group.findByPk(args.id)];
      } else if (args.staff === true) {
        return Group.findAll({
          where: { staff: true },
          include: [{ model: User }],
        });
      } else {
        return Group.findAll();
      }
    },
  },

  Group: {
    permissions: ({ permissions }, { realm }) => {
      if (realm) {
        return permissions.filter(permission => permission.realm === realm);
      } else {
        return permissions;
      }
    },
  },

  Mutation: {
    createGroup(_, { input }) {
      return Group.create(input);
    },

    async modifyGroup(_, { name, input }) {
      const group = await Group.findOne({ where: { name } });
      if (!group) throw new Error("Group doesn't exist");

      group.update(input);

      return group;
    },

    async deleteGroup(_, { name }) {
      const group = await Group.findOne({ where: { name } });

      if (!group) throw new Error("Seems like that group doesn't exist...");

      if (group.name.charAt(0) !== "@") {
        group.destroy();
        return "Group successfully destroyed";
      } else {
        throw new Error(
          "Group " +
            group.name +
            " can't be deleted because it's a special group"
        );
      }
    },

    async addUserToGroup(_, { username, groupName }) {
      const group = await Group.findOne({ where: { name: groupName } });

      const user = await User.findOne({ where: { username } });

      if (!user) throw new Error("User doesn't exist");
      if (!group) throw new Error("Group doesn't exist");

      user.$add("groups", group);
      user.groups.push(group); // For some reason the recently created group doesn't show up, so we append the group we searched earlier

      return user;
    },

    async removeUserFromGroup(_, { username, groupName }) {
      const group = await Group.findOne({
        where: { name: groupName },
      });

      const user = await User.findOne({ where: { username } });

      if (!user) throw new Error("User doesn't exist");
      if (!group) throw new Error("Group doesn't exist");

      user.$remove("groups", group);
      return user; // Can't do the same :(
    },

    async addGroupPerms(_, { groupName, realm, permissions }) {
      const group = await Group.findOne({ where: { name: groupName } });

      if (!group) throw new Error("Group doesn't exist");

      const perms = permissions.map(function(value) {
        return { realm, value, groupId: group.id };
      });

      Permissions.bulkCreate(perms);

      return group;
    },

    async removeGroupPerms(_, { groupName, realm, permissions }) {
      const group = await Group.findOne({ where: { name: groupName } });

      if (!group) throw new Error("Group doesn't exist");

      Permissions.destroy({
        where: { realm, value: permissions, groupId: group.id },
      });

      return group;
    },
  },
};
