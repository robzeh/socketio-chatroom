import Redis from 'ioredis';

// sorted set (zadd)
class PublicRoomStore {
  redisClient: Redis.Redis;

  constructor(redisClient: Redis.Redis) {
    this.redisClient = redisClient;
  };

  // only called on create room? hardcode 1 here?
  saveRoom(roomId: string) {
    this.redisClient.zadd('publicRooms', 'nx', '1', roomId);
  };

  // update room, try during save room user
  async addUser(roomId: string) {
    if (await this.redisClient.zscore('publicRooms', roomId) !== null) {
      this.redisClient.zincrby('publicRooms', 1, roomId);
    }
  };

  async removeUser(roomId: string) {
    if (await this.redisClient.zscore('publicRooms', roomId) !== null) {
      this.redisClient.zincrby('publicRooms', -1, roomId);
    }
  }

  removeRoom(roomId: string) {
    this.redisClient.zrem('publicRooms', roomId);
  };


};

export { PublicRoomStore };
