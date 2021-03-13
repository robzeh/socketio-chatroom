import * as React from 'react';
import { useHistory } from 'react-router';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { User, UserContextType } from '../types';

type HomeProps = {

};

const Home = ({ }: HomeProps) => {
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();
  const history = useHistory();

  // if no username, push back to login
  React.useEffect(() => {
    if (!userDetails.username || 0 === userDetails.username.length) {
      history.push('/login');
    }
  }, []);

  // initialize socket
  React.useEffect(() => {
    socket.init(userDetails);
    // return () => socket.disconnect();
  }, [socket]); // should dep array be socket? or just run on mount

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

  return (
    <div>
      Hello
    </div>
  );
};

export { Home };