import { createClient } from 'redis'

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error("Redis Client error ", err));

(async () => {
    await redisClient.connect();
    console.log("Connected Redis client");
})();

export default redisClient;