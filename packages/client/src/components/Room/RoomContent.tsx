import * as React from 'react';
import { Box } from '@chakra-ui/react';
import { useRoom } from '../../contexts/RoomProvider';
import { RoomContextType, UserContextType } from '../../models/types';
import { RoomFooter } from './RoomFooter';
import { useUser } from '../../contexts/UserProvider';
import { MangaForm } from './MangaForm';

type RoomContentProps = {

};

const RoomContent = ({ }: RoomContentProps) => {
  const { state, dispatch }: RoomContextType = useRoom();
  const { userDetails }: UserContextType = useUser();
  // use toggle here? between manga and form

  return (
    <Box w='70vw'>
      <Box h='80vh'>
        {userDetails.sessionId === state.roomOwner && <MangaForm />}
      </Box>
      <RoomFooter />
    </Box>
  );

};

export { RoomContent };