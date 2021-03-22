import * as React from 'react';
import { ChatMessage } from '../models/types';

type MessageProps = {
  details: ChatMessage
};

const Message = ({ details }: MessageProps) => {
  console.log(details.color);

  return (
    <p>{details.username}: {details.message}</p>
  );

};

export { Message };