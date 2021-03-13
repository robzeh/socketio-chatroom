import { io, Socket } from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import { User } from '../types';

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

}

export { SocketService };