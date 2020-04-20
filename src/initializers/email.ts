import nodemailer from "nodemailer";

// eslint-disable-next-line
declare class process {
  static env: {
    EMAIL_SMTP: string;
    EMAIL_USER: string;
    EMAIL_PASSWORD: string;
  };
}

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
