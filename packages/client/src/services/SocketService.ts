import { io, Socket } from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import { RoomResponse, User } from '../types';

class SocketService {
  #socket: Socket = {} as Socket;

  init(userDetails: User) {
    this.#socket = io(
      'http://localhost:4000',
      {
        auth: {
          username: userDetails.username,
          sessionId: userDetails.sessionId,
          roomId: userDetails.roomId,
        },
      },
    );
    return this;
  };

  // session details from server on initialize 
  onSession(): Observable<User> {
    // @ts-ignore
    return fromEvent(this.#socket, 'SESSION');
  };

  //onLeave(): Observable<string> {
  //  // @ts-ignore
  //  return fromEvent(this.#socket, 'USER_LEFT');
  //}

  createRoom(sessionId: string): Promise<RoomResponse> {
    return new Promise((resolve) => {
      this.#socket.emit('CREATE_ROOM', sessionId, (res: RoomResponse) => {
        if (res.success) {
          resolve({
            success: true,
            roomId: res.roomId
          });
        }
      });
    });
  };

  joinRoom(sessionId: string, roomId: string): Promise<RoomResponse> {
    return new Promise((resolve) => {
      this.#socket.emit('JOIN_ROOM', sessionId, roomId, (res: RoomResponse) => {
        if (res.success) {
          resolve({
            success: true,
            roomId: res.roomId
          });
        } else {
          // room does not exist
          console.log(`${roomId} does not exist`)
          resolve({
            success: false,
            roomId: ''
          });
        }
      });
    });
  };

  leaveRoom(sessionId: string): Promise<RoomResponse> {
    return new Promise((resolve) => {
      this.#socket.emit('LEAVE_ROOM', sessionId, (res: RoomResponse) => {
        if (res.success) {
          resolve({
            success: true,
            roomId: res.roomId
          });
        }
      });
    });
  };

  disconnect(): void {
    console.log('Disconnecting socket');
    this.#socket.disconnect();
  };

};

export { SocketService };