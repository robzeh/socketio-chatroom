import Redis from 'ioredis';

// set
class RoomUserStore {
  redisClient: Redis.Redis;

  constructor(redisClient: Redis.Redis) {
    this.redisClient = redisClient;
  };

  saveRoomUser(roomId: string, sessionId: string): void {
    this.redisClient.sadd(`users:${roomId}`, sessionId);
  };

  removeRoomUser(roomId: string, sessionId: string): void {
    this.redisClient.srem(`users:${roomId}`, sessionId);
  };

  async getAllRoomUsers(roomId: string): Promise<string[]> {
    return await this.redisClient.smembers(`users:${roomId}`);
  };

  async isRoomUser(roomId: string, sessionId: string): Promise<number> {
    return await this.redisClient.sismember(`users:${roomId}`, sessionId);
  };

  async roomSize(roomId: string): Promise<number> {
    return await this.redisClient.scard(`users:${roomId}`);
  }

  removeRoom(roomId: string): void {
    this.redisClient.del(`users:${roomId}`);
  };

};

export { RoomUserStore };