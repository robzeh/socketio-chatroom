import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { SocketService } from '../services/SocketService';
import { Chat } from './Chat';
import { Box, Flex } from '@chakra-ui/react';

type RoomProps = {
  roomId: string,
};

const Room = ({ roomId }: RoomProps) => {
  const socket: SocketService = useSocket();
  const [roomName, setRoomName] = React.useState<string>('');

  React.useEffect(() => {
    const getRoomName = async () => {
      const name = await socket.newRoomName(roomId);
      console.log(name);
      setRoomName(name);
    };
    getRoomName();
  }, []);

  return (
    <Flex h='100vh'>
      <Box>
        <h1>{roomName}</h1>
      </Box>
      <Chat roomId={roomId} />
    </Flex>
  );

};

export { Room };
