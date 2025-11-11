import { createClient } from 'redis';

// create Redis connection
const redisClient = createClient({
  url: 'redis://localhost:6379' // or use REDIS_URL env var for container setup
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis'));

await redisClient.connect();

export default redisClient;
