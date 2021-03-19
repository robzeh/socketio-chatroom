import * as React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
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
    <Container>
      <Form onSubmit={handleSubmit}>
        <Label>Name</Label>
        <Div>
          <Input type='text' name='username' ref={usernameRef} placeholder='Enter a username...' autoComplete='off' />
        </Div>
        <Div>
          <Button type='submit'>Login</Button>
        </Div>
      </Form>
    </Container>
  );

};

export { Login };

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 2px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  position: fixed;
  width: 100%;
  max-width: 320px;
  min-width: 200px;
  min-height: 95vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 15px;
  line-height: 26px;
  cursor: text;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  display: block;
  font-size: inherit;
  line-height: inherit;
`;

const Button = styled.button`
  width: 100%;
  align-items: center;
  height: 30px;
`;