import * as React from 'react';
import { useHistory } from 'react-router';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { RoomFormData, RoomResponse, User, UserContextType } from '../models/types';
import { Choose } from './Choose';
import { Room } from './Room';
import { Header } from './Header';

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

  const createRoom = async ({ roomName, privateRoom }: RoomFormData) => {
    console.log(roomName);
    console.log(privateRoom);

    // create room and set room id
    console.log(userDetails.sessionId);
    const res: RoomResponse = await socket.createRoom(userDetails.sessionId, roomName, privateRoom);
    console.log(res);
    if (res.success) {
      setUserDetails({
        ...userDetails,
        roomId: res.roomId
      });
      console.log('setroom')
      console.log(res.roomId)
      setRoomId(res.roomId);
    }
  };

  const joinRoom = async (roomId: string) => {
    // attempt to join room and set roomid if valid
    const res: RoomResponse = await socket.joinRoom(userDetails.sessionId, roomId);
    if (res.success) {
      setUserDetails({
        ...userDetails,
        roomId: res.roomId
      });
      setRoomId(res.roomId);
    } else {
      // dialog?
      console.log(`${roomId} is not a valid room`);
    }
  };

  return (
    <>
      <Header roomId={roomId} leaveRoom={id => setRoomId(id)} />
      {roomId ? (
        <Room roomId={roomId} />
      ) : (
        <Choose handleCreate={createRoom} handleJoin={joinRoom} />
      )}
    </>
  );
};

export { Home };