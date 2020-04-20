import User from "../models/user";
import Ares from "../models/ares";

import bcrypt from "bcryptjs";
import { createTokens, verificationToken } from "../auth";
import { environment } from "../environment";
import { verify } from "jsonwebtoken";
import { transporter } from "../initializers/email";

import Redis, { hgetallAsync } from "../initializers/redis";

// eslint-disable-next-line
declare class process {
  static env: {
    VERIFICATION_TOKEN_SECRET: string;
  };
}

export default {
  Query: {
    currentUser: (parent, args, { req }) => {
      // this if statement is our authentication check
      if (!req.user) {
        throw new Error("Not Authenticated");
      }
      return User.findByPk(req.user.uuid);
    },

    async users(parent, { username }) {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    },
  },

  User: {
    permissions: ({ permissions }, { realm }) => {
      if (permissions && realm) {
        return permissions
          .filter(
            permission => permission.realm === (!realm ? "game_server" : realm)
          )
          .map(obj => obj.value);
      } else if (permissions) {
        return permissions.map(obj => obj.value);
      }
    },

    joined: ({ createdAt }) => {
      return createdAt;
    },
  },

  Mutation: {
    async signup(_, { token, username, email, password }) {
      const tokenResponse = await hgetallAsync(parseInt(token, 10));

      if (!tokenResponse)
        throw new Error(
          "Token doesn't exist or has expired. Please try again with a new token"
        );

      if (username !== tokenResponse.username)
        throw new Error("Token isn't linked to the username provided");
      else Redis.del(token);

      const user = await User.findByPk(tokenResponse.uuid);
      if (!user) throw new Error("User hasn't joined the server");
      if (user.registered) throw new Error("User is already registered");

      user.email = email;
      const verification_token = verificationToken(user); // eslint-disable-line

      try {
        transporter.sendMail({
          from: "noreply@walrus.gg",
          to: email,
          subject: "Welcome to Walrus! Please verify your account",
          text: `Hello ${user.username}!,\n\nTo complete the sign up process for Walrus, please click the following link: https://walrus.gg/verify/${verification_token}/${email} \n\nThanks,\nWalrus`, // eslint-disable-line
        });
      } catch (error) {
        console.log(error);
      }

      return user.update({
        email,
        password: await bcrypt.hash(password, 12),
        verificationToken: verification_token, // eslint-disable-line
      });
    },

    async login(_, { email, password }, { res }) {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("No user with that email");

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) throw new Error("Incorrect password");

      const { accessToken, refreshToken } = createTokens(user);

      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: environment.secureCookies,
      });
      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: environment.secureCookies,
      });

      return user;
    },

    async invalidateTokens(_, __, { req, res }) {
      if (!req || (req && !req.user)) {
        throw new Error("Not Authenticated");
      }

      const user = await User.findByPk(req.user.uuid);
      if (!user) {
        return false;
      }
      user.count += 1;
      await user.save();

      res.clearCookie("access-token");

      return true;
    },

    async verifyUser(_, { token, email }) {
      try {
        const data = verify(
          token,
          process.env.VERIFICATION_TOKEN_SECRET
        ) as any;

        if (email === data.email) {
          const user = await User.findByPk(data.uuid);
          if (!user) throw new Error("No user with that UUID");

          if (!user.verificationToken) return false;
          else {
            user.update({
              registered: true,
              verificationToken: null,
            });

            return true;
          }
        } else return false;
      } catch {
        return false;
      }
    },

    async userJoin(_, { uuid, username }) {
      const [user, created] = await User.findOrCreate({
        where: { uuid },
        defaults: {
          registered: false,
          usernameAcquisitionDate: new Date(),
        },
      });

      if (!user) throw new Error("User not found");

      if (user.username !== username) {
        user.update({
          username,
          usernameAcquisitionDate: new Date(),
        });
      }

      user.update({
        online: true,
      });

      if (created) {
        const ares = await Ares.create();

        user.$add("groups", [1]); // Default Group
        user.$set("ares", ares!);
      }

      return user;
    },

    async userLeave(_, { username, timePlayed }) {
      const user = await User.findOne({ where: { username } });

      if (!user) throw new Error("User not found");

      user.online = false;
      user.timePlayed = user.timePlayed + timePlayed;

      await user.save();
      return user;
    },

    async updateAresStats(_, { username, stats }) {
      const user = await User.findOne({ where: { username } });

      const ares = await user!.ares.increment(stats);
      user!.ares = ares!;
      return user!;
    },
  },
};
