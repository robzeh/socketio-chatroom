import * as React from 'react';
import { Box } from '@chakra-ui/react';
import { useRoom } from '../../contexts/RoomProvider';
import { RoomContextType, UserContextType } from '../../models/types';
import { RoomFooter } from './RoomFooter';
import { useUser } from '../../contexts/UserProvider';
import { MangaForm } from './MangaForm';
import { useToggle } from '../../hooks/useToggle';
import { Reader } from './Reader';

type RoomContentProps = {

};

const RoomContent = ({ }: RoomContentProps) => {
  const { state, dispatch }: RoomContextType = useRoom();
  const { userDetails }: UserContextType = useUser();
  const [reading, setReading] = useToggle(false);

  // user === owner && manga ? reader : manga form
  // manga ? reader : suggest a managa
  return (
    <Box w='70vw'>
      <Box h='80vh'>
        {userDetails.roomOwner && reading ?
          <Reader /> :
          <MangaForm reading={reading} toggleReading={setReading} />}
      </Box>
      <RoomFooter />
    </Box>
  );

};

export { RoomContent };