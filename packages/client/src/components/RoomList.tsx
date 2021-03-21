import * as React from 'react';

type RoomListProps = {
  toggleList: (event: React.FormEvent<HTMLButtonElement>) => void,
};

const RoomList = ({ toggleList }: RoomListProps) => {
  const [rooms, setRooms] = React.useState<[]>([]);

  return (
    <>
      <button onClick={toggleList}>Go back</button>
      {
        rooms.map((room: any) => (
          <p>room</p>
        ))
      }
    </>
  );
};

export { RoomList };