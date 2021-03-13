import * as React from 'react';
import { useHistory } from 'react-router';
import { useUser } from '../contexts/UserProvider';
import { login } from '../services/loginService';
import { User, UserContextType } from '../types';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (usernameRef.current !== null) {
      const response: User = await login({
        username: usernameRef.current.value,
        sessionId: userDetails.sessionId,
        roomId: userDetails.roomId
      });

      setUserDetails({
        username: response.username,
        sessionId: response.sessionId,
        roomId: response.roomId,
      });
    };

    history.push('/home');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type='text' name='name' ref={usernameRef} />
        </div>
        <div>
          <button type='submit'>Join</button>
        </div>
      </form>
    </div>
  );

};

export { Login };