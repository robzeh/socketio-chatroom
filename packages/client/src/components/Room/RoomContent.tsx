import * as React from 'react';
import { Box } from '@chakra-ui/react';
import { useRoom } from '../../contexts/RoomProvider';
import { RoomContextType } from '../../models/types';
import { RoomFooter } from './RoomFooter';

type RoomContentProps = {

};

const RoomContent = ({ }: RoomContentProps) => {
  const { state, dispatch }: RoomContextType = useRoom();

  return (
    <Box w='70vw'>
      <Box h='80vh'>
      </Box>
      <RoomFooter />
    </Box>
  );

};

export { RoomContent };