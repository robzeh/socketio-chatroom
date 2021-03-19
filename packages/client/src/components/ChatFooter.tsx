import * as React from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useUser } from '../contexts/UserProvider';
import { SocketService } from '../services/SocketService';
import { ChatMessageRequest, UserContextType } from '../types';

type ChatFooterProps = {
  roomId: string
};

const ChatFooter = ({ roomId }: ChatFooterProps) => {
  const [message, setMessage] = React.useState<string>('');
  const { userDetails }: UserContextType = useUser();
  const socket: SocketService = useSocket();

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const messageDetails: ChatMessageRequest = {
      username: userDetails.username,
      message: message,
      roomId: roomId,
      userId: userDetails.userId,
      color: '' // TODO
    };

    socket.sendMessage(messageDetails);
    setMessage('');
  };

  return (
    <>
      <input value={message} type='text' onChange={(e) => setMessage(e.target.value)} placeholder='Send a message...' />
      <button onClick={sendMessage}>Send</button>
    </>
  );

};

export { ChatFooter };