import Redis from 'ioredis';

// hash
class RoomStore {
  redisClient: Redis.Redis;

  constructor(redisClient: Redis.Redis) {
    this.redisClient = redisClient;
  };

  saveRoom(roomId: string, ownerId: string, roomName: string, privateRoom: boolean): void {
    this.redisClient.hset(`rooms:${roomId}`, 'ownerId', ownerId, 'roomName', roomName, 'privateRoom', privateRoom.toString());
  };

  async findRoom(roomId: string): Promise<number> {
    return await this.redisClient.hexists(`rooms:${roomId}`, 'ownerId');
  };

  async getRoomOwner(roomId: string): Promise<string[]> {
    return await this.redisClient.hmget(`rooms:${roomId}`, 'ownerId');
  };

  async getRoomName(roomId: string): Promise<string[]> {
    return await this.redisClient.hmget(`rooms:${roomId}`, 'roomName');
  };

  removeRoom(roomId: string): void {
    this.redisClient.del(`rooms:${roomId}`);
  };

};

export { RoomStore };