import * as React from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { RoomContextType, UserContextType } from '../../models/types';
import { useRoom } from '../../contexts/RoomProvider';
import { useSocket } from '../../contexts/SocketProvider';
import { SocketService } from '../../services/SocketService';
import { useUser } from '../../contexts/UserProvider';

type RoomFooterProps = {

};

const RoomFooter = ({ }: RoomFooterProps) => {
  const { state, dispatch }: RoomContextType = useRoom();
  const socket: SocketService = useSocket();
  const { userDetails }: UserContextType = useUser();

  const onSubmit = () => {
    socket.userReady(userDetails.roomId);
  };

  // ready subscription
  React.useEffect(() => {
    const readySubscription = socket.onReady().subscribe(() => {
      dispatch({ type: 'userReady' });
    });

    return () => readySubscription.unsubscribe();
  }, [socket]);

  return (
    <Box h='12vh' p={2}>
      <Flex h='100%' alignItems='center' justifyContent='space-between'>
        <Heading>{state.roomName}</Heading>
        <Box d='flex' alignItems='center' justifyContent='center'>
          <p>{state.ready}/{state.users}</p>
          <Button onClick={onSubmit} ml={2} size='sm'>Ready</Button>
        </Box>
      </Flex>
    </Box>
  );

};

export { RoomFooter };