import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { RoomProvider } from '../contexts/RoomProvider';
import { SocketProvider } from '../contexts/SocketProvider';
import { UserProvider } from '../contexts/UserProvider';
import { Home } from './Home';
import { Login } from './Login';

const App = () => {

  return (
    <UserProvider>
      <SocketProvider>
        <RoomProvider>
          <Router>
            <Switch>
              <Route path='/home' component={Home} exact />
              <Route path='/login' component={Login} exact />
              <Route path='/' component={Login} exact />
            </Switch>
          </Router>
        </RoomProvider>
      </SocketProvider>
    </UserProvider>
  );
};

export { App };
