import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { RoomResponse, UserContextType } from '../models/types';
import { Chat } from './Chat';
import { Box, Flex } from '@chakra-ui/react';

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
    <Flex h='100vh'>
      <Box>
        <h1>{roomName}</h1>
        <button onClick={leave}>Leave Room</button>
      </Box>
      <Chat roomId={roomId} />
    </Flex>
  );

};

export { Room };
