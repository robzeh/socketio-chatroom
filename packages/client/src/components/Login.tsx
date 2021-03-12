import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { SocketService } from '../services/SocketService';

const Login = () => {
  const usernameRef = React.useRef<HTMLInputElement | null>(null);
  const socket: SocketService = useSocket();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (usernameRef.current !== null) {
      const details = {
        username: usernameRef.current.value,
        sessionId: 1,
        roomId: '',
      }
      socket.init(details);
    }
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