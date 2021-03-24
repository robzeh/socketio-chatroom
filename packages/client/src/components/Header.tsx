import * as React from 'react';
import { Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { RoomResponse, UserContextType } from '../models/types';
import { SocketService } from '../services/SocketService';
import { useUser } from '../contexts/UserProvider';
import { useSocket } from '../contexts/SocketProvider';
import { FaRegUser } from 'react-icons/fa';
import { INITIAL_USER_DETAILS } from '../constants';
import { useHistory } from 'react-router';

type HeaderProps = {
  roomId: string,
  leaveRoom: (id: string) => void
};

const Header = ({ roomId, leaveRoom }: HeaderProps) => {
  const socket: SocketService = useSocket();
  const { userDetails, setUserDetails }: UserContextType = useUser();
  const history = useHistory();

  const leave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res: RoomResponse = await socket.leaveRoom(userDetails.sessionId);
    if (res.success) {
      setUserDetails({
        ...userDetails,
        roomId: ''
      });
      // set parent room id
      leaveRoom('');
    }
  };

  const logout = () => {
    socket.disconnect();
    setUserDetails(INITIAL_USER_DETAILS);
    history.push('/login');
  };

  return (
    <Box bg='gray.600' px={4}>
      <Flex h={14} alignItems='center' justifyContent='space-between' >
        {roomId ? (
          <Button onClick={leave}>Leave Room</Button>
        ) : (
          <Spacer />
        )}
        <Menu>
          <MenuButton as={Button}>
            <Icon as={FaRegUser} />
          </MenuButton>
          <MenuList>
            <MenuItem>Change Username</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>

  );

};

export { Header };