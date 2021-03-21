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
  addUser(roomId: string) {
    this.redisClient.zincrby('publicRooms', 1, roomId);
  };

  removeUser(roomId: string) {
    this.redisClient.zincrby('publicRooms', -1, roomId);
  }

  removeRoom(roomId: string) {
    this.redisClient.zrem('publicRooms', roomId);
  };


};

export { PublicRoomStore };
