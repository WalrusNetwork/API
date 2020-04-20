import { sign, verify } from "jsonwebtoken";
import { environment } from "./environment";
import User from "./models/user";

// eslint-disable-next-line
declare class process {
  static env: {
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    VERIFICATION_TOKEN_SECRET: string;
    CONSOLE_TOKEN: string;
  };
}

if (
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.CONSOLE_TOKEN
)
  throw new Error(
    "Invalid refresh or access token secrets, or invalid console API token"
  );

export const createTokens = (user: User) => {
  const refreshToken = sign(
    { uuid: user.uuid, email: user.email, count: user.count },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  const accessToken = sign(
    {
      uuid: user.uuid,
      email: user.email,
      apiPermissions: user.apiPermissions,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "5min",
    }
  );

  return { refreshToken, accessToken };
};

export const verificationToken = (user: User) => {
  const verificationToken = sign(
    {
      uuid: user.uuid,
      email: user.email,
    },
    process.env.VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return verificationToken;
};

export const authMiddleware = async (req: any, res, next) => {
  const refreshToken = req.cookies["refresh-token"];
  const accessToken = req.cookies["access-token"];

  // if the user has no refresh token and no access token, don't continue
  if (!refreshToken && !accessToken) {
    return next();
  }

  // Try verifying the access token, if valid don't continue (nothing else to do)
  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;
    req.user = data;
    return next();
  } catch {} // eslint-disable-line

  // If we are here the access token isn't valid, that's why we check if the user has a refresh token in this step
  if (!refreshToken) {
    return next();
  }

  let data;

  // We check if the refresh token is valid, if it isn't don't continue
  try {
    data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as any;
  } catch {
    return next();
  }

  // Refresh token is valid, about to generate a new access token
  try {
    const user = await User.findByPk(data.uuid);

    // If no user or the user count is invalid, don't continue
    if (!user || user.count !== data.count) {
      return next();
    }

    const tokens = createTokens(user);

    res.cookie("refresh-token", tokens.refreshToken, {
      httpOnly: true,
      secure: environment.secureCookies,
    });
    res.cookie("access-token", tokens.accessToken, {
      httpOnly: true,
      secure: environment.secureCookies,
    });
    req.user = user;

    next();
  } catch {
    next();
  }
};
