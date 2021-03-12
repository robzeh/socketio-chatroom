import { io, Socket } from 'socket.io-client';
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

}

export { SocketService };