import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { UserContextType } from '../types';

type UsersProps = {
  roomId: string
};

const Users = ({ roomId }: UsersProps) => {
  // type array of User?
  const [users, setUsers] = React.useState<string[]>([]);
  const { userDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();

  // on room join, get existing users
  React.useEffect(() => {
    const getExistingUsers = async () => {
      const existingUsers: string[] = await socket.newRoom(roomId);
      console.log(existingUsers);
      setUsers(existingUsers);
    };
    getExistingUsers();
  }, []);

  // user join and leave subscriptions
  React.useEffect(() => {
    const userJoinSubscription = socket.onJoin().subscribe(({ username }) => {
      console.log(username);
      setUsers((prevUsers) => [...prevUsers, username]);
    })

    const userLeaveSubscription = socket.onLeave().subscribe(({ username }) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user !== username));
    });

    return () => {
      userJoinSubscription.unsubscribe();
      userLeaveSubscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <h2>Users</h2>
      {users.map((user) => (
        <p>{user}</p>
      ))}
    </>
  );

};

export { Users };