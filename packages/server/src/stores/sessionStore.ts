import Redis from 'ioredis';
import { Session } from '../types';

const SESSION_TTL = 24 * 60 * 60; // 1 day

// hash
class SessionStore {
  redisClient: Redis.Redis;

  constructor(redisClient: Redis.Redis) {
    this.redisClient = redisClient;
  };

  // is sessionId really a number? i think its suppose to be string
  async findSession(sessionId: string): Promise<Session> {
    const res: string[] = await this.redisClient.hmget(`session:${sessionId}`, 'username', 'roomId');
    return ({
      username: res[0],
      roomId: res[1]
    });
  };

  saveSession(sessionId: string, { username, roomId }: Session): void {
    this.redisClient
      .multi()
      .hset(
        `session:${sessionId}`,
        'username',
        username,
        'roomId',
        roomId
      )
      .expire(`session:${sessionId}`, SESSION_TTL)
      .exec();
  }

};

export { SessionStore };