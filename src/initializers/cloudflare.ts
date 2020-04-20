import cloudflare from "cloudflare";

const Cloudflare = new cloudflare({
  email: process.env.CLOUDFLARE_EMAIL,
  key: process.env.CLOUDFLARE_KEY,
  token: process.env.CLOUDFLARE_TOKEN,
});

export default Cloudflare;
