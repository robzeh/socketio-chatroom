import { SessionStore } from './sessionStore';
import Redis from 'ioredis';

const redis: Redis.Redis = new Redis();

// initialize stores
const sessionStore: SessionStore = new SessionStore(redis);

export { sessionStore };

