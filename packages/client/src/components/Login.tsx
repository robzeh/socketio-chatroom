import * as React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useUser } from '../contexts/UserProvider';
import { LoginFormData, UserContextType } from '../models/types';
import { useForm } from 'react-hook-form';
import { loginValidation } from '../models/schemas';


const Login = () => {
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const { register, handleSubmit, errors } = useForm<LoginFormData>();
  const history = useHistory();

  // check if they had a username
  React.useEffect(() => {
    if (userDetails.username) {
      history.push('/home');
    }
  }, []);

  const onSubmit = handleSubmit(async ({ username }: LoginFormData) => {
    setUserDetails({
      ...userDetails,
      username: username
    });
    history.push('/home');
  });

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Label>Name</Label>
        <Div>
          <Input type='text' name='username' ref={register(loginValidation)} placeholder='Enter a username...' autoComplete='off' />
          {errors.username && <div>{errors.username.message}</div>}
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