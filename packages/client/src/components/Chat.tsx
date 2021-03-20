import * as React from 'react';
import styled from 'styled-components';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { UserContextType } from '../models/types';
import { ChatFooter } from './ChatFooter';
import { Messages } from './Messages';
import { Users } from './Users';

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
    <Container>
      <h1>Hello {userDetails.username}</h1>
      <p>You are in room: {roomId}</p>
      <Users roomId={roomId} />
      <Messages roomId={roomId} />
      <ChatFooter roomId={roomId} />
    </Container>
  );

};

export { Chat };

const Container = styled.div`
  width: 150px;
`;
