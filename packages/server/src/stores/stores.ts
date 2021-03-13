import { SessionStore } from './sessionStore';
import { RoomStore } from './roomStore';
import Redis from 'ioredis';

const redis: Redis.Redis = new Redis();

// initialize stores
const sessionStore: SessionStore = new SessionStore(redis);
const roomStore: RoomStore = new RoomStore(redis);

export { sessionStore, roomStore };

