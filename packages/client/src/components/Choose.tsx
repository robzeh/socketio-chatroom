import * as React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useToggle } from '../hooks/useToggle';
import { roomCodeValidation } from '../models/schemas';
import { RoomFormData } from '../models/types';
import { RoomForm } from './RoomForm';
import { RoomList } from './RoomList';

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
    <Container>
      <CardContainer>
        {roomForm && <RoomForm toggleForm={setRoomForm} handleCreate={handleCreate} />}
        {roomList && <RoomList toggleList={setRoomList} handleJoin={handleJoin} />}
        {!roomList && !roomForm && (
          <>
            <Card>
              <Form>
                <Button onClick={setRoomForm}>Create Room</Button>
              </Form>
            </Card>
            <Card>
              <Form onSubmit={onSubmit}>
                <Input type='text' name='roomId' ref={register(roomCodeValidation)} placeholder='Room Code' autoComplete='off' />
                <Button type='submit'>Join Room</Button>
                {errors.roomId && <div>{errors.roomId.message}</div>}
              </Form>
            </Card>
            <Card>
              <Form>
                <Button onClick={setRoomList}>Find a room</Button>
              </Form>
            </Card>
          </>
        )}
      </CardContainer>
    </Container>
  );

};

export { Choose };

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Form = styled.form`
  width: 50%;
`;

const Card = styled.div`
  width: 100%;
  min-height: 100px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border-radius: 3px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled.div`
  width: 100%;
  max-width: 320px;
  min-width: 200px;
  min-height: 95vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 769px) {
    flex-direction: row;
    max-width: 640px;
  }
`;

const Button = styled.button`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
`;
//
//        {roomList ? (
//          <>
//            <Card>
//              <p>Rooms</p>
//              <button onClick={() => setRoomList(!roomList)}>Go back</button>
//            </Card>
//          </>
//        ) : (
//          <>
//            <Card>
//              <Form onSubmit={handleCreate}>
//                <Button type='submit'>Create Room</Button>
//              </Form>
//            </Card>
//            <Card>
//              <Form onSubmit={handleJoin}>
//                <Input type='text' ref={ref} placeholder='Room Code' />
//                <Button type='submit'>Join Room</Button>
//              </Form>
//            </Card>
//            <Card>
//              <Form onSubmit={() => setRoomList(!roomList)}>
//                <Button type='submit'>Find a room</Button>
//              </Form>
//            </Card>
//          </>
//        )}