import * as React from 'react';
import { useSocket } from '../../contexts/SocketProvider';
import { useUser } from '../../contexts/UserProvider';
import { SocketService } from '../../services/SocketService';
import { UserContextType } from '../../models/types';
import { ChatFooter } from './ChatFooter';
import { Messages } from './Messages';
import { Users } from './Users';
import { Flex } from '@chakra-ui/react';

type ChatProps = {
  roomId: string
};

const Chat = ({ roomId }: ChatProps) => {
  const { userDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();

  /**
   * users
   * messages
   * input area
   */
  return (
    <Flex direction='column' w='30vw'>
      <Users roomId={roomId} />
      <Messages roomId={roomId} />
      <ChatFooter roomId={roomId} />
    </Flex>
  );

};

export { Chat };
