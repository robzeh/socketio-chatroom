import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { SocketService } from '../services/SocketService';
import { ChatMessage } from '../models/types';
import { Message } from './Message';

type MessagesProps = {
  roomId: string
};

const Messages = ({ roomId }: MessagesProps) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const socket: SocketService = useSocket();

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
    <>
      {messages.map((m: ChatMessage) => (
        <Message details={m} />
      ))}
    </>
  );

};

export { Messages };