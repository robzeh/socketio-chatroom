import { SessionStore } from './sessionStore';
import { RoomStore } from './roomStore';
import { RoomUserStore } from './roomUserStore';
import Redis from 'ioredis';

const redis: Redis.Redis = new Redis();

// initialize stores
const sessionStore: SessionStore = new SessionStore(redis);
const roomStore: RoomStore = new RoomStore(redis);
const roomUserStore: RoomUserStore = new RoomUserStore(redis);

export { sessionStore, roomStore, roomUserStore };

