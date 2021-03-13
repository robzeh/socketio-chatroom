import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { RoomResponse, UserContextType } from '../types';

type RoomProps = {
  roomId: string,
  leaveRoom: (id: string) => void
};

const Room = ({ roomId, leaveRoom }: RoomProps) => {
  const socket: SocketService = useSocket();
  const { userDetails, setUserDetails }: UserContextType = useUser();

  const leave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res: RoomResponse = await socket.leaveRoom(userDetails.sessionId);
    if (res.success) {
      setUserDetails({
        ...userDetails,
        roomId: ''
      });
      // set parent room id
      leaveRoom('');
    }
  };

  return (
    <div>
      <h1>hello {userDetails.username}, you are in room {roomId}</h1>
      <button onClick={leave}>Leave Room</button>
    </div>
  );

};

export { Room };