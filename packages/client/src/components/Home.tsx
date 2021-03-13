import * as React from 'react';
import { useHistory } from 'react-router';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { RoomResponse, User, UserContextType } from '../types';

type HomeProps = {

};

const Home = ({ }: HomeProps) => {
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();
  const history = useHistory();
  const [roomId, setRoomId] = React.useState<string>('');

  // if no username, push back to login
  React.useEffect(() => {
    if (!userDetails.username || 0 === userDetails.username.length) {
      history.push('/login');
    }
  }, []);

  // initialize socket
  React.useEffect(() => {
    socket.init(userDetails);
    return () => socket.disconnect();
  }, []); // should dep array be socket? or just run on mount

  // get updated userDetails from server, socket.on('SESSION)
  React.useEffect(() => {
    if (socket === null) return;
    const sessionSubscription = socket.onSession().subscribe((res: User) => {
      setUserDetails({
        username: res.username,
        sessionId: res.sessionId,
        roomId: res.roomId
      });
    });
    return () => sessionSubscription.unsubscribe();
  }, [socket]);

  // try to join last room
  React.useEffect(() => {
    if (userDetails.roomId) {
      const tryRoom = async () => {
        const res: RoomResponse = await socket.joinRoom(userDetails.sessionId, userDetails.roomId);
        if (res.success) {
          setRoomId(res.roomId);
        } else {
          setRoomId('');
        }
      };
      tryRoom();
    }
  }, []);

  return (
    <>
      {roomId ? (
        <div>ROOM</div>
      ) : (
        <div>CHOOSE A ROOM</div>
      )}
    </>
  );
};

export { Home };