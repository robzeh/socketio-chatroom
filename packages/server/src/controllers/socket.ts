import { Server, Socket } from 'socket.io';
import { roomStore, roomUserStore, sessionStore, publicRoomStore } from '../stores/stores';
import { ChatMessage, MangaSocket, RoomDetails, RoomListItem, RoomResponse, RoomUser, Session, SessionDetails } from '../types'

export default function (io: Server) {
  // emit session details to user on login
  const onLogin = async function (cb: (res: SessionDetails) => void) {
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
      roomId: roomId,
      userId: socket.userId,
      color: socket.color
    });

    // emit session details to user
    cb({
      username: socket.username,
      sessionId: socket.sessionId,
      roomId: socket.roomId,
      userId: socket.userId,
      color: socket.color
    });

  };

  const createRoom = async function (sessionId: string, roomName: string, privateRoom: boolean, cb: (res: RoomResponse) => void) {
    const socket: MangaSocket = this; // hence the 'function' above, as an arrow function will not work
    const roomId: string = Math.floor(100000 + Math.random() * 900000).toString();

    // roomname privatroom 
    // save to room store with ownerId as sessionId
    roomStore.saveRoom(roomId, sessionId, roomName, privateRoom);

    console.log(!privateRoom);
    // if public room add to public room store
    if (!privateRoom) {
      publicRoomStore.saveRoom(roomId);
    }

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

      // try public room
      await publicRoomStore.addUser(roomId);

      socket.join(roomId);

      // emit to room that user joined
      console.log(session.username);
      io.to(roomId).emit('USER_JOIN', {
        username: session.username,
        userId: session.userId,
        color: session.color
      });

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
    io.to(roomId).emit('USER_LEFT', {
      username: session.username,
      userId: session.userId,
      color: session.color
    });

    // remove from room user store\
    roomUserStore.removeRoomUser(roomId, sessionId);
    await publicRoomStore.removeUser(roomId);

    cb({
      success: true,
      roomId: ''
    });
  }

  // rename newRoomUsers?
  const newRoom = async function (roomId: string, cb: (res: RoomUser[]) => void) {
    const socket: MangaSocket = this;
    // get room users usernames
    const roomUsers: string[] = await roomUserStore.getAllRoomUsers(roomId);

    // do i want to send usernames or user object?
    // loop through room users and get their session info

    const getRoomUsers: () => Promise<RoomUser[]> = async () => {
      let roomUsersUsernames: RoomUser[] = [];
      for (const sessId of roomUsers) {
        const session: Session = await sessionStore.findSession(sessId);
        const user: RoomUser = {
          username: session.username,
          userId: session.userId,
          color: session.color
        }
        roomUsersUsernames.push(user);
      }
      return roomUsersUsernames;
    };

    const allRoomUsers: RoomUser[] = await getRoomUsers();
    cb(allRoomUsers);
  };

  const newRoomDetails = async function (roomId: string, cb: (res: RoomDetails) => void) {
    const roomName: string[] = await roomStore.getRoomName(roomId);
    const roomOwner: string[] = await roomStore.getRoomOwner(roomId);
    cb({
      roomName: roomName[0],
      roomOwner: roomOwner[0]
    });
  };

  // room list
  const getRooms = async function (start: number, end: number, cb: (res: RoomListItem[]) => void) {
    const rooms: string[] = await publicRoomStore.getRooms(start, end);

    let roomItems: RoomListItem[] = [];
    // getRooms returns [i=roomId, i+1=users]
    for (let i = 0; i < rooms.length; i += 2) {
      // room name, ownerid
      const room: string[] = await roomStore.getRoomInfo(rooms[i])
      // [ownerName]
      const ownerName: string[] = await sessionStore.getOwner(room[i + 1]);
      const roomItem: RoomListItem = {
        roomName: room[0],
        owner: ownerName[0],
        users: rooms[i + 1],
        roomId: rooms[i]
      };
      roomItems.push(roomItem);
    };

    cb(roomItems);
  };

  const message = function ({ username, message, roomId, color }: ChatMessage) {
    io.in(roomId).emit('MESSAGE', ({ username, message, color }));
  };

  const ready = function (roomId: string) {
    io.in(roomId).emit('USER_READY', ('userReady'));
  };

  const disconnect = async function () {
    const socket: MangaSocket = this;
    console.log(`Bye ${socket.username}`);

    // if user was in room, remove from room and emit to room
    const session = await sessionStore.findSession(socket.sessionId);
    // pretty sure session.roomId is either always valid or '' by this point
    if (session.roomId) {
      const room: number = await roomStore.findRoom(session.roomId);
      if (room) {
        roomUserStore.removeRoomUser(session.roomId, socket.sessionId);
        await publicRoomStore.removeUser(session.roomId);
        // emit to room that user left
        io.to(session.roomId).emit('USER_LEFT', {
          username: session.username,
          userId: session.userId,
          color: session.color
        });
      }
    }

  };

  return {
    onLogin,
    createRoom,
    joinRoom,
    leaveRoom,
    newRoom,
    newRoomDetails,
    getRooms,
    message,
    disconnect,
    ready
  };

};
