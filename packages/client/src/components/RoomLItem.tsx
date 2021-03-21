import * as React from 'react';

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
    <div onClick={onSubmit}>
      <p>{roomName} hosted by {owner} with {users} users</p>
    </div>
  );

};

export { RoomLItem };