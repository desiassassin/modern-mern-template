// Import configuration modules
import * as redisConfig from "./redis.js";
import * as mongodbConfig from "./mongodb.js";

export const redis = {
     connect: redisConfig.connect,
     client: redisConfig.client,
     getClient: redisConfig.getClient,
     getCache: redisConfig.getCache,
     setCache: redisConfig.setCache,
     invalidateCache: redisConfig.invalidateCache
};

export const mongodb = {
     connect: mongodbConfig.connect
};
