import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { SocketService } from '../services/SocketService';
import { Chat } from './Chat';
import { Box, Flex } from '@chakra-ui/react';
import { RoomContent } from './RoomContent';

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
    <Flex h='92vh' w='100vw'>
      <RoomContent />
      <Chat roomId={roomId} />
    </Flex>
  );

};

export { Room };
