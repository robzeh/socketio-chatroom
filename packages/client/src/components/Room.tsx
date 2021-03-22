import * as React from 'react';
import styled from 'styled-components';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { RoomResponse, UserContextType } from '../models/types';
import { Chat } from './Chat';

type RoomProps = {
  roomId: string,
  leaveRoom: (id: string) => void
};

const Room = ({ roomId, leaveRoom }: RoomProps) => {
  const socket: SocketService = useSocket();
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const [roomName, setRoomName] = React.useState<string>('');

  React.useEffect(() => {
    const getRoomName = async () => {
      const name = await socket.newRoomName(roomId);
      console.log(name);
      setRoomName(name);
    };
    getRoomName();
  }, []);

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
    <Container>
      <h1>{roomName}</h1>
      <button onClick={leave}>Leave Room</button>
      <Chat roomId={roomId} />
    </Container>
  );

};

export { Room };

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;