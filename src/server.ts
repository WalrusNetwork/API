require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import gql from "graphql-tag";
import { permissions } from "./permissions";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";

import { sequelize } from "./initializers/sequelize";
import Group from "./models/group";
import { authMiddleware } from "./auth";

import { environment } from "./environment";
import resolvers from "./resolvers";
import typeDefs from "./schemas";

import registerService from "./register";

(async () => {
  await sequelize.sync();

  // Create a default group if there isn't one
  const [group, created] = await Group.findOrCreate({
    where: { id: 1, name: "@default" },
    defaults: {
      priority: 10,
    },
  });

  if (group && created)
    console.log("No default group has been found. A new one has been created");

  const schema = applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    permissions
  );

  const server = new ApolloServer({
    schema,
    introspection: !environment.secureCookies,
    playground: !environment.secureCookies,
    subscriptions: { path: "/" },
    context: async ({ req, res, connection }: any) => {
      if (connection) return connection.context;

      const tokenWithBearer = req.headers.authorization || "";
      const token = tokenWithBearer.split(" ")[1];

      const defaultGroup = await Group.findOne({ where: { name: "@default" } });
      if (!defaultGroup)
        throw new Error("There is no default group for some reason...");
      const anon = !req.user ? defaultGroup.apiPermissions : null;

      const query = gql`
        ${req.body.query}
      `;

      const operationType = query.definitions[0].operation; // Gets request type (query or mutation)
      const operationName =
        query.definitions[0].selectionSet.selections[0].name.value; // Gets query/mutation name

      return {
        token,
        anon,
        req,
        res,
        operationType,
        operationName,
      };
    },
  });

  const app = express();

  app.use((error, req: any, res, next) => {
    if (error instanceof SyntaxError) {
      throw new Error("Wrong query");
    } else {
      next();
    }
  });

  app.use(cookieParser());
  app.use(authMiddleware);

  if (!process.env.FRONTEND_URL || !process.env.FRONTEND_URL.startsWith("http"))
    throw new Error(
      "Invalid frontend URL. Please provide a new one or modify your existing one to include http:// or https://."
    );

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true, // <-- REQUIRED backend setting
    })
  );

  server.applyMiddleware({ app, path: "/", cors: false }); // app is from an existing express app

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  // Initializes the registration service
  registerService();

  httpServer.listen({ port: environment.port }, () => {
    console.log(
      `Server ready at http://localhost:${environment.port}${server.graphqlPath}.`
    );
    console.log(
      `Subscriptions ready at ws://localhost:${environment.port}${server.subscriptionsPath}.`
    );
  });
})();
