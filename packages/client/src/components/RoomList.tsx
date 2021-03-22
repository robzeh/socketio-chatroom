import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { RoomListItem } from '../models/types';
import { SocketService } from '../services/SocketService';
import { RoomLItem } from './RoomLItem';

type RoomListProps = {
  toggleList: (event: React.FormEvent<HTMLButtonElement>) => void,
  handleJoin: (roomId: string) => Promise<void>
};

const RoomList = ({ toggleList, handleJoin }: RoomListProps) => {
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
      <div>
        {rooms.map((room) => (
          <RoomLItem roomName={room.roomName} owner={room.owner} users={room.users} roomId={room.roomId} handleJoin={handleJoin} />
        ))}
      </div>
    </>
  );
};

export { RoomList };