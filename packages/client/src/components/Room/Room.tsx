import * as React from 'react';
import { useSocket } from '../../contexts/SocketProvider';
import { SocketService } from '../../services/SocketService';
import { Chat } from '../Chat/Chat';
import { Box, Flex } from '@chakra-ui/react';
import { RoomContent } from './RoomContent';
import { useRoom } from '../../contexts/RoomProvider';
import { RoomContextType, RoomState } from '../../models/types';

type RoomProps = {
  roomId: string,
};

const Room = ({ roomId }: RoomProps) => {
  const socket: SocketService = useSocket();
  const { state, dispatch }: RoomContextType = useRoom();

  React.useEffect(() => {
    const getRoomDetails = async () => {
      const roomDetails: Partial<RoomState> = await socket.newRoomDetails(roomId);
      dispatch({ type: 'roomName', payload: roomDetails.roomName });
      dispatch({ type: 'setOwner', payload: roomDetails.roomOwner });
    };
    getRoomDetails();
  }, []);

  return (
    <Flex h='92vh' w='100vw'>
      <RoomContent />
      <Chat roomId={roomId} />
    </Flex>
  );

};

export { Room };
