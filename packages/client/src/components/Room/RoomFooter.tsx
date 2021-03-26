import * as React from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { RoomContextType } from '../../models/types';
import { useRoom } from '../../contexts/RoomProvider';

type RoomFooterProps = {

};

const RoomFooter = ({ }: RoomFooterProps) => {
  const { state, dispatch }: RoomContextType = useRoom();

  const onSubmit = () => {
    dispatch({
      type: 'userReady'
    });
  };

  return (
    <Box h='12vh' p={2}>
      <Flex h='100%' alignItems='center' justifyContent='space-between'>
        <Heading>{state.roomName}</Heading>
        <Box d='flex' alignItems='center' justifyContent='center'>
          <p>{state.ready}/{state.users}</p>
          <Button onClick={onSubmit} ml={2}>Ready</Button>
        </Box>
      </Flex>
    </Box>
  );

};

export { RoomFooter };