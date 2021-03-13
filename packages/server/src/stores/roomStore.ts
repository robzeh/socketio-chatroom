import Redis from 'ioredis';

// hash
class RoomStore {
  redisClient: Redis.Redis;

  constructor(redisClient: Redis.Redis) {
    this.redisClient = redisClient;
  };

  async findRoom(roomId: string): Promise<number> {
    return await this.redisClient.hexists(`rooms:${roomId}`, 'ownerId');
  };

  saveRoom(roomId: string, ownerId: string): void {
    this.redisClient.hset(`rooms:${roomId}`, 'ownerId', ownerId);
  };

  removeRoom(roomId: string): void {
    this.redisClient.del(`rooms:${roomId}`);
  };

};

export { RoomStore };