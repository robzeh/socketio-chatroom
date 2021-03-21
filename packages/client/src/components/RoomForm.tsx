import * as React from 'react';
import { RoomFormData } from '../models/types';
import { ToggleButton } from './ToggleButton';
import { useForm } from 'react-hook-form';
import { useToggle } from '../hooks/useToggle';
import { roomNameValidation } from '../models/schemas';
// (event: React.FormEvent<HTMLFormElement>) => void

type RoomFormProps = {
  toggleForm: (event: React.FormEvent<HTMLButtonElement>) => void,
  handleCreate: ({ roomName, privateRoom }: RoomFormData) => Promise<void>
};

const RoomForm = React.forwardRef(({ toggleForm, handleCreate }: RoomFormProps, ref: React.Ref<HTMLButtonElement>) => {
  const { register, handleSubmit, errors } = useForm<RoomFormData>();
  const [privateRoom, setPrivateRoom] = useToggle(false);

  const onSubmit = handleSubmit(({ roomName }) => {
    handleCreate({ roomName, privateRoom });
  })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPrivateRoom();
  };

  return (
    <>
      <button onClick={toggleForm} >Cancel create</button>
      <form onSubmit={onSubmit}>
        <input type='text' name='roomName' ref={register(roomNameValidation)} placeholder='Room Name' autoComplete='off' />
        <button type='button' onClick={handleClick}>toggle private</button>
        {privateRoom ? <p>private</p> : <p>public</p>}
        <button type='submit'>Create room</button>
        {errors.roomName && <div>{errors.roomName.message}</div>}
      </form>
    </>
  );

});

export { RoomForm };