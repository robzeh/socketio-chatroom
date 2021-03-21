import Redis from 'ioredis';

// sorted set (zadd)
class PublicRoomStore {
  redisClient: Redis.Redis;

  constructor(redisClient: Redis.Redis) {
    this.redisClient = redisClient;
  };

  // only called on create room? hardcode 1 here?
  saveRoom(roomId: string): void {
    this.redisClient.zadd('publicRooms', 'nx', '1', roomId);
  };

  // update room, try during save room user
  async addUser(roomId: string): Promise<void> {
    if (await this.redisClient.zscore('publicRooms', roomId) !== null) {
      this.redisClient.zincrby('publicRooms', 1, roomId);
    }
  };

  async removeUser(roomId: string): Promise<void> {
    if (await this.redisClient.zscore('publicRooms', roomId) !== null) {
      this.redisClient.zincrby('publicRooms', -1, roomId);
    }
  };

  async getRooms(start: number, end: number): Promise<string[]> {
    return await this.redisClient.zrevrange('publicRooms', start, end, "WITHSCORES");
  };

  removeRoom(roomId: string): void {
    this.redisClient.zrem('publicRooms', roomId);
  };


};

export { PublicRoomStore };
