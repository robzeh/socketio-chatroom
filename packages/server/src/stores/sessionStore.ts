import Redis from 'ioredis';
import { Session } from '../types';

const SESSION_TTL = 24 * 60 * 60; // 1 day

// hash
class SessionStore {
  redisClient: Redis.Redis;

  constructor(redisClient: Redis.Redis) {
    this.redisClient = redisClient;
  };

  async findSession(sessionId: string): Promise<Session> {
    const res: string[] = await this.redisClient.hmget(`session:${sessionId}`, 'username', 'roomId', 'userId', 'color');
    return ({
      username: res[0],
      roomId: res[1],
      userId: res[2],
      color: res[3]
    });
  };

  saveSession(sessionId: string, { username, roomId, userId, color }: Session): void {
    this.redisClient
      .multi()
      .hset(
        `session:${sessionId}`,
        'username',
        username,
        'roomId',
        roomId,
        'userId',
        userId,
        'color',
        color
      )
      .expire(`session:${sessionId}`, SESSION_TTL)
      .exec();
  }

};

export { SessionStore };