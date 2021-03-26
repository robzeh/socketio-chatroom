import * as React from 'react';
import { Button, Td, Th, Tr } from '@chakra-ui/react';

type RoomListItemProps = {
  roomName: string,
  owner: string,
  users: string,
  roomId: string,
  handleJoin: (roomId: string) => Promise<void>
};

const RoomLItem = ({ roomName, owner, users, roomId, handleJoin }: RoomListItemProps) => {

  const onSubmit = async () => {
    await handleJoin(roomId);
  }

  return (
    <Tr onClick={onSubmit}>
      <Td>{roomName}</Td>
      <Td textAlign='right'>{owner}</Td>
      <Td textAlign='right'>{users}</Td>
      <Td textAlign='right'>
        <Button size='sm' onClick={onSubmit}>Join</Button>
      </Td>
    </Tr>
  );

};

export { RoomLItem };