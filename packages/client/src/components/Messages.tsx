import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { SocketService } from '../services/SocketService';
import { ChatMessage } from '../models/types';
import { Message } from './Message';
import { Box } from '@chakra-ui/react';

type MessagesProps = {
  roomId: string
};

const Messages = ({ roomId }: MessagesProps) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const socket: SocketService = useSocket();

  const setRef = React.useCallback((node) => {
    if (node) node.scrollIntoView({ smooth: true });
  }, []);

  // message subscription
  React.useEffect(() => {
    const messageSubscription = socket.onMessage().subscribe(({ username, message, userId, color }) => {
      const newMessage: ChatMessage = {
        username: username,
        message: message,
        userId: userId,
        color: color
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => messageSubscription.unsubscribe();
  }, [socket]);

  return (
    <Box h='60vh' p={2} mb={2} overflow='scroll' overflowX='hidden'>
      {messages.map((m: ChatMessage, index: number) => {
        const lastMessage = messages.length - 1 === index;
        return (
          <>
            <Message details={m} />
            <div ref={lastMessage ? setRef : null} />
          </>
        )
      })}
    </Box>
  );

};

export { Messages };