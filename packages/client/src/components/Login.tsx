import * as React from 'react';
import { useHistory } from 'react-router';
import { useUser } from '../contexts/UserProvider';
import { LoginFormData, UserContextType } from '../models/types';
import { useForm } from 'react-hook-form';
import { loginValidation } from '../models/schemas';
import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Input } from '@chakra-ui/react';


const Login = () => {
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const { register, handleSubmit, errors, formState } = useForm<LoginFormData>();
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
    <Center h='100vh'>
      <Box p={6} boxShadow='base' rounded='md'>
        <Box>
          <Heading textAlign='center'>manga2gether</Heading>
        </Box>
        <Box mt={4}>
          <form onSubmit={onSubmit} >
            <FormControl isInvalid={errors.username ? true : false}>
              <FormLabel>Username</FormLabel>
              <Input name='username' ref={register(loginValidation)} placeholder='Enter a username...' autoComplete='off' size='lg' />
              <FormErrorMessage>
                {errors.username && errors.username.message}
              </FormErrorMessage>
            </FormControl>
            <Center>
              <Button type='submit' mt={2} w='100%'>
                Login
              </Button>
            </Center>
          </form>
        </Box>
      </Box>
    </Center>
  );

};

export { Login };
