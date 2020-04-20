import { Sequelize } from "sequelize-typescript";

// eslint-disable-next-line
declare class process {
  static env: {
    DATABASE_URL: string;
  };
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  storage: ":memory:",
  logging: false,
  models: [__dirname + "/../models"],
});
