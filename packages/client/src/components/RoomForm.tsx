import * as React from 'react';
import { RoomFormData } from '../models/types';
import { ToggleButton } from './ToggleButton';
import { useForm } from 'react-hook-form';
import { useToggle } from '../hooks/useToggle';
import { roomNameValidation } from '../models/schemas';
import styled from 'styled-components';
// (event: React.FormEvent<HTMLFormElement>) => void

type RoomFormProps = {
  toggleForm: (event: React.FormEvent<HTMLButtonElement>) => void,
  handleCreate: ({ roomName, privateRoom }: RoomFormData) => Promise<void>
};

const RoomForm = ({ toggleForm, handleCreate }: RoomFormProps) => {
  const { register, handleSubmit, errors } = useForm<RoomFormData>();
  const [privateRoom, setPrivateRoom] = useToggle(false);

  const onSubmit = handleSubmit(async ({ roomName }) => {
    await handleCreate({ roomName, privateRoom });
  })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPrivateRoom();
  };

  return (
    <Container>
      <Div>
        <button onClick={toggleForm} >Cancel create</button>
      </Div>
      <Form onSubmit={onSubmit}>
        <Div>
          <Input type='text' name='roomName' ref={register(roomNameValidation)} placeholder='Room Name' autoComplete='off' />
          <button type='button' onClick={handleClick}>toggle private</button>
          <label>Make private</label>
        </Div>
        <Div>
          <Button type='submit'>Create room</Button>
        </Div>
        {errors.roomName && <div>{errors.roomName.message}</div>}
      </Form>
    </Container>
  );

};

export { RoomForm };

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  min-width: 320px;
  min-height: 150px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border-radius: 3px;
`;

const Div = styled.div`
  width: 100%;
`;

const Form = styled.form`
  height: 100%;
`;

const Input = styled.input`
  width: 99%;
`;

const Button = styled.button`
  width: 75%;
`;