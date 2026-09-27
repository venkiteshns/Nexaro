import { createClient } from 'redis'

const redisClient = createClient({
    url: process.env.REDIS_URL
});
import logger from "../utils/logger.js";

redisClient.on('error', (err) => logger.error("Redis Client error ", err));

(async () => {
    await redisClient.connect();
    logger.info("Connected Redis client", { name: "redis-server in Docker" });
})();

export default redisClient;