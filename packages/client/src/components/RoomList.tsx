import * as React from 'react';

type RoomListProps = {

};

const RoomList = ({ }: RoomListProps) => {
  const [rooms, setRooms] = React.useState<[]>([]);

  return (
    <>
      {
        rooms.map((room: any) => (
          <p>room</p>
        ))
      }
    </>
  );
};

export { RoomList };