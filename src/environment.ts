const defaultPort = 4000;

// eslint-disable-next-line
declare class process {
  static env: {
    PORT: number;
    NODE_ENV: string;
  };
}

interface Environment {
  port: number;
  secureCookies: boolean;
}

export const environment: Environment = {
  port: process.env.PORT || defaultPort,
  secureCookies:
    process.env.NODE_ENV === "DEPLOYMENT" ||
    process.env.NODE_ENV === "PRODUCTION"
      ? true
      : false,
};
