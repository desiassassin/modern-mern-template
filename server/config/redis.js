import Redis from "ioredis";

export let client = null;

export async function connect() {
     return new Promise(async (resolve, reject) => {
          try {
               client = new Redis(process.env.REDIS_URL);

               client.on("connect", (err) => {
                    console.log("Redis client is connected");
                    resolve();
               });
               client.on("error", (err) => {
                    setTimeout(() => {
                         console.log(`Retrying connection to Redis ...`, err);
                         connect();
                    }, 2000);
               });
          } catch (err) {
               console.log("Error connecting to redis....");
               reject(err);
          }
     });
}

export async function getCache(key) {
     let result = JSON.parse(await client.get(key));
     return result;
}

/**
 * Sets a value in the cache with an optional expiry time.
 *
 * @param {string} key - The key to set the value under
 * @param {*} value - The value to cache
 * @param {number} expiryInSeconds - Optional expiry time in minutes. Defaults to 1 day.
 * @returns {Promise} Resolves when value is set in cache
 */
export async function setCache(key, value, expiryInSeconds = 86400) {
     const stringifiedValue = JSON.stringify(value);
     return await client.set(key, stringifiedValue, "EX", expiryInSeconds);
}

export async function invalidateCache(key) {
     try {
          await client.del(key);
     } catch (error) {
          console.error("Error deleting cache:", error);
     }
}

/**
 * Returns the Redis client instance
 * @returns {Redis}
 */
export function getClient() {
     return client;
}
