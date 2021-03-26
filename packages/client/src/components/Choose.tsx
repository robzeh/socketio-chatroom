import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useToggle } from '../hooks/useToggle';
import { roomCodeValidation } from '../models/schemas';
import { RoomFormData } from '../models/types';
import { RoomForm } from './RoomForm';
import { RoomList } from './RoomList';
import { Box, Button, Center, Container, Flex, FormControl, FormErrorMessage, Input, Stack } from '@chakra-ui/react';

type ChooseProps = {
  handleCreate: ({ roomName, privateRoom }: RoomFormData) => Promise<void>,
  handleJoin: (roomId: string) => Promise<void>
};

const Choose = ({ handleCreate, handleJoin }: ChooseProps) => {
  const { register, handleSubmit, errors } = useForm<{ roomId: string }>();
  const [roomForm, setRoomForm] = useToggle(false);
  const [roomList, setRoomList] = useToggle(false);

  const onSubmit = handleSubmit(async ({ roomId }) => {
    await handleJoin(roomId);
  });

  /**
   * case 1 - create room form
   * case 2 - room list view
   * default - 3 cards 
   */

  return (
    <Center h='92vh'>
      {roomForm && <RoomForm toggleForm={setRoomForm} handleCreate={handleCreate} />}
      {roomList && <RoomList toggleList={setRoomList} handleJoin={handleJoin} />}
      {!roomList && !roomForm && (
        <Stack direction={["column", "column", "column", "row"]}>
          <Box p={6} minH='150px' minW='285px' boxShadow='base' rounded='md' d='flex' alignItems='center' justifyContent='center'>
            <Button onClick={setRoomForm}>Create Room</Button>
          </Box>
          <Box p={6} minH='150px' minW='285px' boxShadow='base' rounded='md'>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={errors.roomId ? true : false} display='flex' flexDirection='column' alignItems='center' justifyItems='center'>
                <Input w='50%' type='text' name='roomId' ref={register(roomCodeValidation)} placeholder='Room Code' autoComplete='off' />
                <FormErrorMessage w='100'>
                  {errors.roomId && errors.roomId.message}
                </FormErrorMessage>
                <Button type='submit' mt={2}>Join Room</Button>
              </FormControl>
            </form>
          </Box>
          <Box p={6} minH='150px' minW='285px' boxShadow='base' rounded='md' d='flex' alignItems='center' justifyContent='center'>
            <Button onClick={setRoomList}>Find a room</Button>
          </Box>
        </Stack>
      )}
    </Center>
  );

};

export { Choose };
