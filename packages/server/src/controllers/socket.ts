import { Server, Socket } from 'socket.io';
import { roomStore, roomUserStore, sessionStore } from '../stores/stores';
import { MangaSocket, RoomResponse, Session } from '../types'

export default function (io: Server) {
  // emit session details to user on login
  const onLogin = async function () {
    const socket: MangaSocket = this;

    console.log(`${socket.username} connected`);
    // check if their last room is still active
    let roomId = socket.roomId;
    if (!await roomStore.findRoom(socket.roomId)) {
      roomId = ''; // room doesnt exist
    }

    // save session
    sessionStore.saveSession(socket.sessionId, {
      username: socket.username,
      roomId: roomId
    });

    // emit session details to user
    socket.emit('SESSION', {
      username: socket.username,
      sessionId: socket.sessionId,
      roomId: socket.roomId
    });

  };

  const createRoom = async function (sessionId: string, cb: (res: RoomResponse) => void) {
    const socket: MangaSocket = this; // hence the 'function' above, as an arrow function will not work

    const roomId: string = Math.floor(100000 + Math.random() * 900000).toString();

    // save to room store with ownerId as sessionId
    roomStore.saveRoom(roomId, sessionId);

    // update session
    const session: Session = await sessionStore.findSession(sessionId);
    sessionStore.saveSession(sessionId, {
      ...session,
      roomId: roomId
    });

    // save to room users store
    roomUserStore.saveRoomUser(roomId, sessionId);

    // join room 
    socket.join(roomId);

    // send roomId back to user
    cb({
      success: true,
      roomId: roomId
    });
  };

  const joinRoom = async function (sessionId: string, roomId: string, cb: (res: RoomResponse) => void) {
    const socket: MangaSocket = this;
    // check if room exists
    const room: number = await roomStore.findRoom(roomId);
    if (room) {
      // update session
      const session: Session = await sessionStore.findSession(sessionId);
      sessionStore.saveSession(sessionId, {
        ...session,
        roomId: roomId
      });

      // save to room users store
      roomUserStore.saveRoomUser(roomId, sessionId);

      // emit to room that user joined
      socket.join(roomId);

      cb({
        success: true,
        roomId: roomId
      });
    } else {
      cb({
        success: false,
        roomId: ''
      });
    }
  }

  const leaveRoom = async function (sessionId: string, cb: (res: RoomResponse) => void) {
    const socket: MangaSocket = this;
    // remove user from room
    const session: Session = await sessionStore.findSession(sessionId);
    const roomId: string = session.roomId;
    socket.leave(roomId);

    // update session
    sessionStore.saveSession(sessionId, {
      ...session,
      roomId: ''
    });

    // emit to room, username or session id???
    //io.to(roomId).emit('USER_LEFT', session.username);

    // remove from room user store\
    roomUserStore.removeRoomUser(roomId, sessionId);

    cb({
      success: true,
      roomId: ''
    });
  }

  const disconnect = async () => {
    const socket: MangaSocket = this;
    console.log(`Bye ${socket.username}`);

    // if user was in room, remove from room and emit to room
    const session = await sessionStore.findSession(socket.sessionId);
    // pretty sure session.roomId is either always valid or '' by this point
    if (session.roomId) {
      roomUserStore.removeRoomUser(session.roomId, socket.sessionId);
      // emit to room that user left
      // io.to(roomid)
    }

  }

  return {
    onLogin,
    createRoom,
    joinRoom,
    leaveRoom,
    disconnect
  };

};
