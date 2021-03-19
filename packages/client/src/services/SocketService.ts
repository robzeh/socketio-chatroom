import { io, Socket } from 'socket.io-client';
import { from, fromEvent, Observable } from 'rxjs';
import { ChatMessage, ChatMessageRequest, RoomResponse, RoomUser, User, UserJoinResponse } from '../types';

class SocketService {
  #socket: Socket = {} as Socket;

  init(userDetails: User): Promise<User> {
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
    return new Promise((resolve) => {
      this.#socket.emit('SESSION', (res: User) => {
        resolve(res);
      });
    });
  };

  // session details from server on initialize 
  //onSession(): Observable<User> {
  //  // @ts-ignore
  //  return fromEvent(this.#socket, 'SESSION');
  //};

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

  // get existing room users on join
  newRoom(roomId: string): Promise<RoomUser[]> {
    return new Promise((resolve) => {
      this.#socket.emit('NEW_ROOM', roomId, (res: RoomUser[]) => {
        resolve(res);
      });
    });
  };

  sendMessage(message: ChatMessageRequest): void {
    this.#socket.emit('MESSAGE', message);
  };

  onMessage(): Observable<ChatMessage> {
    // @ts-ignore
    return fromEvent(this.#socket, 'MESSAGE');
  };

  onJoin(): Observable<RoomUser> {
    // @ts-ignore
    return fromEvent(this.#socket, 'USER_JOIN');
  };

  onLeave(): Observable<RoomUser> {
    // @ts-ignore    
    return fromEvent(this.#socket, 'USER_LEFT');
  };

  disconnect(): void {
    console.log('Disconnecting socket');
    this.#socket.disconnect();
  };

};

export { SocketService };