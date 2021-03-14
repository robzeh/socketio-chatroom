import { SessionStore } from './sessionStore';
import { RoomStore } from './roomStore';
import { RoomUserStore } from './roomUserStore';
import Redis from 'ioredis';
import { REDIS_PORT } from '../utils/env';

const redis: Redis.Redis = new Redis(REDIS_PORT);

// initialize stores
const sessionStore: SessionStore = new SessionStore(redis);
const roomStore: RoomStore = new RoomStore(redis);
const roomUserStore: RoomUserStore = new RoomUserStore(redis);

export { redis, sessionStore, roomStore, roomUserStore };

