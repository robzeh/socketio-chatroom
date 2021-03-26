import * as React from 'react';
import { RoomFormData, UserContextType } from '../../models/types';
import { useForm } from 'react-hook-form';
import { useToggle } from '../../hooks/useToggle';
import { roomNameValidation } from '../../models/schemas';
import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Input, Spacer, Switch } from '@chakra-ui/react';
import { useUser } from '../../contexts/UserProvider';

type RoomFormProps = {
  toggleForm: (event: React.FormEvent<HTMLButtonElement>) => void,
  handleCreate: ({ roomName, privateRoom }: RoomFormData) => Promise<void>
};

const RoomForm = ({ toggleForm, handleCreate }: RoomFormProps) => {
  const { register, handleSubmit, errors } = useForm<RoomFormData>();
  const [privateRoom, setPrivateRoom] = useToggle(false);
  const { userDetails }: UserContextType = useUser();

  const onSubmit = handleSubmit(async ({ roomName }) => {
    await handleCreate({ roomName, privateRoom });
  })

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(privateRoom);
    // TODO: ensure private room value is right
    setPrivateRoom();
  };

  return (
    <Box p={6} minH='200px' boxShadow='base' rounded='md' d='flex' alignItems='center' justifyContent='center'>
      <form onSubmit={onSubmit}>
        <FormControl d='flex' flexDirection='column' alignItems='center' justifyContent='center' isInvalid={errors.roomName ? true : false}>
          <Box w='100%'>
            <FormLabel>Room Name</FormLabel>
            <Input type='text' name='roomName' ref={register(roomNameValidation)} placeholder={`${userDetails.username}'s room`} autoComplete='off' />
            <FormErrorMessage maxW='250px'>
              {errors.roomName && errors.roomName.message}
            </FormErrorMessage>

          </Box>
          <Box w='100%' m={4} d='flex' justifyContent='center'>
            <FormLabel pt={2}>Make private</FormLabel>
            <Spacer />
            <Switch size='lg' onChange={handleClick} />
          </Box>
          <Box>
            <Button onClick={toggleForm}>Cancel create</Button>
            <Button type='submit'>Create room</Button>
          </Box>
        </FormControl>
      </form>
    </Box>
  );

};

export { RoomForm };
