import { shield, or } from "graphql-shield";
import { hasPermission, isServer } from "./rules";

export const permissions = shield({
  Query: {
    "*": hasPermission,
    serverList: or(hasPermission, isServer),
    serverLocations: or(hasPermission, isServer),
  },

  Mutation: {
    "*": hasPermission,
    createServer: or(hasPermission, isServer),
    destroyServer: or(hasPermission, isServer),
  },
});
