import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { ChatMessageRequest, UserContextType } from '../models/types';
import { useForm } from 'react-hook-form';
import { messageValidation } from '../models/schemas';
import { Box, Button, Flex, Input } from '@chakra-ui/react';

type ChatFooterProps = {
  roomId: string
};

const ChatFooter = ({ roomId }: ChatFooterProps) => {
  const { userDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();
  const { register, handleSubmit, errors } = useForm<{ message: string }>();

  const onSubmit = handleSubmit(({ message }, e) => {
    const messageDetails: ChatMessageRequest = {
      username: userDetails.username,
      message: message,
      roomId: roomId,
      userId: userDetails.userId,
      color: '' // TODO
    };

    socket.sendMessage(messageDetails);
    e?.target.reset(); // or reset() api?
  });

  return (
    <Flex>
      <form onSubmit={onSubmit}>
        <Input name='message' type='text' ref={register(messageValidation)} placeholder='Send a message...' autoComplete='off' />
        <Button type='submit'>Send</Button>
      </form>
    </Flex>
  );

};

export { ChatFooter };