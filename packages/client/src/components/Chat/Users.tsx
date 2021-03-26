import * as React from 'react';
import { useSocket } from '../../contexts/SocketProvider';
import { useUser } from '../../contexts/UserProvider';
import { SocketService } from '../../services/SocketService';
import { RoomUser, UserContextType } from '../../models/types';
import { User } from './User';
import { Box } from '@chakra-ui/react';
import { useRoom } from '../../contexts/RoomProvider';

type UsersProps = {
  roomId: string
};

const Users = ({ roomId }: UsersProps) => {
  // type array of User?
  const [users, setUsers] = React.useState<RoomUser[]>([]);
  const { userDetails }: UserContextType = useUser();
  const { state, dispatch } = useRoom();
  const socket: SocketService = useSocket();

  // on room join, get existing users
  React.useEffect(() => {
    const getExistingUsers = async () => {
      const existingUsers: RoomUser[] = await socket.newRoom(roomId);
      console.log(existingUsers);
      setUsers(existingUsers);
      dispatch({
        type: 'setUsers',
        payload: existingUsers.length
      });
      console.log(state.users);
    };
    getExistingUsers();
  }, []);

  // user join and leave subscriptions
  React.useEffect(() => {
    const userJoinSubscription = socket.onJoin().subscribe(({ username, userId, color }: RoomUser) => {
      const newUser = {
        username: username,
        userId: userId,
        color: color
      }
      setUsers((prevUsers) => [...prevUsers, newUser]);
      dispatch({ type: 'userJoin' });
    })

    const userLeaveSubscription = socket.onLeave().subscribe(({ userId }: RoomUser) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
      dispatch({ type: 'userLeft' });
    });

    return () => {
      userJoinSubscription.unsubscribe();
      userLeaveSubscription.unsubscribe();
    };
  }, []);

  return (
    <Box h='20vh'>
      <h2>Users</h2>
      {users.map((user: RoomUser) => (
        <User details={user} />
      ))}
    </Box>
  );

};

export { Users };