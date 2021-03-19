import * as React from 'react';
import { useHistory } from 'react-router';
import { useUser } from '../contexts/UserProvider';
import { UserContextType } from '../types';

const Login = () => {
  const usernameRef = React.useRef<HTMLInputElement | null>(null);
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const history = useHistory();

  // check if they had a username
  React.useEffect(() => {
    if (userDetails.username) {
      history.push('/home');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (usernameRef.current !== null) {
      setUserDetails({
        username: usernameRef.current.value,
        sessionId: userDetails.sessionId,
        roomId: userDetails.roomId,
        userId: userDetails.userId,
        color: userDetails.color
      });
      history.push('/home');
    };

  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type='text' name='username' ref={usernameRef} />
        </div>
        <div>
          <button type='submit'>Join</button>
        </div>
      </form>
    </div>
  );

};

export { Login };