import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { RoomListItem } from '../models/types';
import { SocketService } from '../services/SocketService';

type RoomListProps = {
  toggleList: (event: React.FormEvent<HTMLButtonElement>) => void,
};

const RoomList = ({ toggleList }: RoomListProps) => {
  // room item type? 
  const [rooms, setRooms] = React.useState<RoomListItem[]>([]);
  const socket: SocketService = useSocket();

  // get total number of rooms to show for dynamic paging?
  React.useEffect(() => {
    const getRooms = async () => {
      // make it start = x, end = x + 10?, store in usestate?
      const topRooms = await socket.getRooms(0, 10);
      console.log(topRooms);
      setRooms(topRooms);
    };
    getRooms();
  }, []);

  return (
    <>
      <button onClick={toggleList}>Go back</button>
      {
        rooms.map((room: any) => (
          <p>{room.roomName} hosted by {room.owner} - {room.users}</p>
        ))
      }
    </>
  );
};

export { RoomList };