import { SessionStore } from './sessionStore';
import { RoomStore } from './roomStore';
import { RoomUserStore } from './roomUserStore';
import Redis from 'ioredis';
import { REDIS_PORT } from '../utils/env';
import { PublicRoomStore } from './publicRoomStore';

const redis: Redis.Redis = new Redis(REDIS_PORT);

// initialize stores
const sessionStore: SessionStore = new SessionStore(redis);
const roomStore: RoomStore = new RoomStore(redis);
const roomUserStore: RoomUserStore = new RoomUserStore(redis);
const publicRoomStore: PublicRoomStore = new PublicRoomStore(redis);

export { redis, sessionStore, roomStore, roomUserStore, publicRoomStore };

