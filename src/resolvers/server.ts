/* eslint-disable @typescript-eslint/no-explicit-any */

import { PubSub, withFilter } from "apollo-server-express";
import vultr from "../initializers/vultr";
import Redis, { getAsync } from "../initializers/redis";
import Cloudflare from "../initializers/cloudflare";

const pubsub: PubSub = new PubSub();
const zone_id = process.env.CLOUDFLARE_ZONE;

const Decodify = (input: any) => {
  const a = Object.entries(input).map(e => ({ [e[0]]: e[1] }));
  const array: Array<any> = [];

  for (const every of a) {
    const number: string | undefined = Object.getOwnPropertyNames(every).pop();
    if (number !== undefined) {
      array.push(every[number]);
    }
  }

  return array;
};

const getLocations = async () => {
  let locations = JSON.parse(await getAsync("locations"));

  if (!locations) {
    locations = Decodify(await vultr.regions.list());

    Redis.set("locations", JSON.stringify(locations));
    Redis.expire("locations", 1500);
  }

  return locations;
};

const afterCreation = async (SUBID: number, label: string) => {
  const server = await vultr.server.list({ SUBID });

  if (server.main_ip === "0.0.0.0")
    return setTimeout(afterCreation, 5000, SUBID, label);

  const record = {
    type: "A",
    name: `${label}`,
    content: server.main_ip,
    ttl: 120,
    proxied: false,
  };

  const response = await Cloudflare.dnsRecords.add(zone_id, record);
  if (response.success) Redis.set(SUBID.toString(), response.result.id);
};

export default {
  Subscription: {
    serverReady: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("serverReady"),
        (payload, variables) => {
          return Number(payload.serverReady.SUBID) === variables.id;
        }
      ),
    },

    serverClosed: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("serverClosed"),
        (payload, variables) => {
          return Number(payload.serverClosed.SUBID) === variables.id;
        }
      ),
    },
  },

  Query: {
    async serverLocations() {
      return Decodify(await vultr.regions.list());
    },

    async serverList() {
      return Decodify(await vultr.server.list());
    },
  },

  Location: {
    datacenterId: ({ DCID }) => {
      return DCID;
    },

    regionCode: ({ regioncode }) => {
      return regioncode;
    },
  },

  Server: {
    id: ({ SUBID }) => {
      return Number(SUBID);
    },

    name: ({ label }) => {
      return label;
    },

    datacenterId: ({ DCID }) => {
      return Number(DCID);
    },

    cores: ({ vcpu_count }) => {
      return Number(vcpu_count);
    },

    ip: ({ main_ip }) => {
      return main_ip;
    },
  },

  Mutation: {
    async createServer(_, { details, regionCode }) {
      const VPSPLANID: number = 401;
      const OSID: number = 159;

      let DCID: number;
      let datacenter: String;

      let isoList = JSON.parse(await getAsync("isoList"));

      if (!isoList) {
        isoList = Decodify(await vultr.iso.list());

        Redis.set("isoList", JSON.stringify(isoList));
        Redis.expire("isoList", 300);
      }

      const iso = isoList.filter((iso: { filename: string }) => {
        return iso.filename === "slim.iso";
      });

      const locations = await getLocations();

      const region = locations.find((obj: { regioncode: string }) => {
        return obj.regioncode === regionCode.toUpperCase();
      });

      if (!region)
        return {
          success: false,
        };

      datacenter = region.name;
      DCID = Number(region.DCID);

      const label = details
        ? details.username.toLowerCase()
        : "walrus-" +
          Math.random()
            .toString(36)
            .substring(7);

      const content = details
        ? `OP_USERNAME=${details.username}\nOP_UUID=${details.uuid}\nSERVERNAME=${label}`
        : `SERVERNAME=${label}`;

      const userdata = {
        "conf.d": {
          entries: {
            minecraft: {
              perm: "0600",
              content,
            },
          },
        },
      };

      const confirmation = await vultr.server.create({
        DCID,
        VPSPLANID,
        OSID,
        ISOID: iso[0].ISOID.toString(),
        notify_activate: "no",
        label,
        userdata: Buffer.from(JSON.stringify(userdata)).toString("base64"),
      });

      if (confirmation.error)
        return {
          success: false,
        };

      // Only do it if details are provided (private server)
      if (details)
        setTimeout(afterCreation, 10000, Number(confirmation.SUBID), label);

      return {
        success: true,
        location: datacenter,
        serverId: confirmation.SUBID,
      };
    },

    async serverReady(_, { id }) {
      const server = await vultr.server.list({ SUBID: id });

      if (server.error || server.status !== "active") return false;

      pubsub.publish("serverReady", { serverReady: server });
      return true;
    },

    async destroyServer(_, { id }) {
      const server = await vultr.server.list({ SUBID: id });
      // If the server doesn't exist, return true (already destroyed)
      if (server.error) return true;

      if (server.status !== "active") return false;
      if (!server.label.startsWith("walrus-")) {
        const dnsId = await getAsync(id.toString());
        await Cloudflare.dnsRecords.del(zone_id, dnsId);
      }

      pubsub.publish("serverClosed", { serverClosed: server });
      vultr.server.delete({ SUBID: id });
      return true;
    },
  },
};
