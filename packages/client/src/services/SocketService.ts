import { io, Socket } from 'socket.io-client';
import { from, fromEvent, Observable } from 'rxjs';
import { ChatMessage, ChatMessageRequest, RoomListItem, RoomResponse, RoomUser, User, UserJoinResponse } from '../models/types';

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
          userId: userDetails.userId,
          color: userDetails.color
        },
      },
    );
    return new Promise((resolve) => {
      this.#socket.emit('SESSION', (res: User) => {
        resolve(res);
      });
    });
  };

  createRoom(sessionId: string, roomName: string, privateRoom: boolean): Promise<RoomResponse> {
    return new Promise((resolve) => {
      this.#socket.emit('CREATE_ROOM', sessionId, roomName, privateRoom, (res: RoomResponse) => {
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

  // refactor to observable? so users can change naem
  newRoomName(roomId: string): Promise<string> {
    return new Promise((resolve) => {
      this.#socket.emit('NEW_ROOM_NAME', roomId, (res: string) => {
        resolve(res);
      });
    });
  };

  getRooms(start: number, end: number): Promise<RoomListItem[]> {
    return new Promise((resolve) => {
      this.#socket.emit('GET_ROOMS', start, end, (res: RoomListItem[]) => {
        resolve(res);
      });
    });
  };

  userReady(roomId: string): void {
    this.#socket.emit('USER_READY', roomId);
  };

  sendMessage(message: ChatMessageRequest): void {
    this.#socket.emit('MESSAGE', message);
  };

  onMessage(): Observable<ChatMessage> {
    // @ts-ignore
    return fromEvent(this.#socket, 'MESSAGE');
  };

  // empty observable?
  onReady(): Observable<string> {
    // @ts-ignore
    return fromEvent(this.#socket, 'USER_READY');
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