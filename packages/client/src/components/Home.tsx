import * as React from 'react';
import { useHistory } from 'react-router';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { RoomResponse, User, UserContextType } from '../types';
import { Choose } from './Choose';
import { Room } from './Room';

type HomeProps = {

};

const Home = ({ }: HomeProps) => {
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();
  const history = useHistory();
  const [roomId, setRoomId] = React.useState<string>('');
  const roomRef = React.useRef<HTMLInputElement | null>(null);

  // if no username, push back to login
  React.useEffect(() => {
    if (!userDetails.username || 0 === userDetails.username.length) {
      history.push('/login');
    }
  }, []);

  // initialize socket
  React.useEffect(() => {
    const login = async () => {
      const user: User = await socket.init(userDetails);
      console.log(user);
      setUserDetails({
        username: user.username,
        sessionId: user.sessionId,
        roomId: user.roomId,
        userId: user.userId,
        color: user.color
      });
    };
    login();
    return () => socket.disconnect();
  }, []); // should dep array be socket? or just run on mount

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

  const createRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // create room and set room id
    console.log(userDetails.sessionId);
    const res: RoomResponse = await socket.createRoom(userDetails.sessionId);
    if (res.success) {
      setUserDetails({
        ...userDetails,
        roomId: res.roomId
      });
      setRoomId(res.roomId);
    }
  };

  const joinRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // attempt to join room and set roomid if valid
    if (roomRef.current !== null) {
      const res: RoomResponse = await socket.joinRoom(userDetails.sessionId, roomRef.current.value);
      if (res.success) {
        setUserDetails({
          ...userDetails,
          roomId: res.roomId
        });
        setRoomId(res.roomId);
      } else {
        // dialog?
        console.log(`${roomRef.current.value} is not a valid room`);
      }
    }
  };

  return (
    <>
      {roomId ? (
        <Room roomId={roomId} leaveRoom={id => setRoomId(id)} />
      ) : (
        <Choose handleCreate={createRoom} handleJoin={joinRoom} ref={roomRef} />
      )}
    </>
  );
};

export { Home };