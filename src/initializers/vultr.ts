import * as VultrNode from "@vultr/vultr-node";

const vultr = VultrNode.initialize({
  apiKey: process.env.VULTR_TOKEN,
});

export default vultr;
