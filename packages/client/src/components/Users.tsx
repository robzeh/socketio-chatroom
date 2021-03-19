import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { RoomUser, UserContextType } from '../types';
import { User } from './User';

type UsersProps = {
  roomId: string
};

const Users = ({ roomId }: UsersProps) => {
  // type array of User?
  const [users, setUsers] = React.useState<RoomUser[]>([]);
  const { userDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();

  // on room join, get existing users
  React.useEffect(() => {
    const getExistingUsers = async () => {
      const existingUsers: RoomUser[] = await socket.newRoom(roomId);
      console.log(existingUsers);
      setUsers(existingUsers);
    };
    getExistingUsers();
  }, []);

  // user join and leave subscriptions
  React.useEffect(() => {
    const userJoinSubscription = socket.onJoin().subscribe(({ username, color }: RoomUser) => {
      const newUser = {
        username: username,
        color: color
      }
      setUsers((prevUsers) => [...prevUsers, newUser]);
    })

    const userLeaveSubscription = socket.onLeave().subscribe(({ username }: RoomUser) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
    });

    return () => {
      userJoinSubscription.unsubscribe();
      userLeaveSubscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <h2>Users</h2>
      {users.map((user: RoomUser) => (
        <User details={user} />
      ))}
    </>
  );

};

export { Users };