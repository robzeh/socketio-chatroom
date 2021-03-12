import { SocketProvider } from '../contexts/SocketProvider';
import { Login } from './Login';

const App = () => {

  return (
    <SocketProvider>
      <Login />
    </SocketProvider>
  );
};

export { App };
