import * as React from 'react';
import { ChatMessage } from '../../models/types';
import { Box, Text } from '@chakra-ui/react';

type MessageProps = {
  details: ChatMessage
};

const Message = ({ details }: MessageProps) => {
  console.log(details.color);

  return (
    <Box d='flex'>
      <Text color={`${details.color}.600`} mr={1}>{details.username}:</Text>
      <Text>{details.message}</Text>
    </Box>
  );

};

export { Message };