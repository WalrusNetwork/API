import { rule, or } from "graphql-shield";

const userHasPermission = rule({ cache: "strict" })(
  async (parent, args, ctx, info) => {
    const every = ctx.req.user.apiPermissions.includes(
      // Checks if logged user has permission to do every query/mutation
      "api." + ctx.operationType.toLowerCase() + ".*"
    );

    const specific = ctx.req.user.apiPermissions.includes(
      // Checks if logged user has permission to do that
      "api." +
        ctx.operationType.toLowerCase() +
        "." +
        ctx.operationName.toLowerCase()
    );

    return every || specific;
  }
);

const anonHasPermission = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    const every = ctx.anon.includes(
      // Checks if anon user has permission to do every query/mutation
      "api." + ctx.operationType.toLowerCase() + ".*"
    );

    const specific = ctx.anon.includes(
      // Checks if anon user has permission to do that
      "api." +
        ctx.operationType.toLowerCase() +
        "." +
        ctx.operationName.toLowerCase()
    );

    return every || specific;
  }
);

const isConsole = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.token === process.env.CONSOLE_TOKEN;
  }
);

export const isServer = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.token === process.env.SERVER_TOKEN;
  }
);

export const hasPermission = or(
  userHasPermission,
  anonHasPermission,
  isConsole
);
