import * as React from 'react';
import { useSocket } from '../../contexts/SocketProvider';
import { RoomListItem } from '../../models/types';
import { SocketService } from '../../services/SocketService';
import { RoomLItem } from './RoomLItem';
import { Box, Button, Flex, Tab, Table, TabList, Tabs, Tbody, Th, Thead, Tr } from '@chakra-ui/react';

type RoomListProps = {
  toggleList: (event: React.FormEvent<HTMLButtonElement>) => void,
  handleJoin: (roomId: string) => Promise<void>
};

const RoomList = ({ toggleList, handleJoin }: RoomListProps) => {
  // room item type? 
  const [rooms, setRooms] = React.useState<RoomListItem[]>([]);
  const socket: SocketService = useSocket();

  // get total number of rooms to show for dynamic paging?
  React.useEffect(() => {
    const getRooms = async () => {
      // make it start = x, end = x + 10?, store in usestate?
      const topRooms = await socket.getRooms(0, 10);
      console.log(topRooms);
      setRooms(topRooms);
    };
    getRooms();
  }, []);

  // tab list, get total number of rooms? divide

  return (
    <Box boxShadow='base' p={6} rounded='md' minW='75vw' minH='250px'>
      <Flex justifyContent='space-between' mr={6}>
        <Button onClick={toggleList} size='sm' ml={6}>Go Back</Button>
        <Tabs variant='enclosed-colored'>
          <TabList>
            <Tab>1</Tab>
            <Tab>2</Tab>
            <Tab>...</Tab>
            <Tab>4</Tab>
          </TabList>
        </Tabs>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Th>Room Name</Th>
            <Th textAlign='right'>Owner</Th>
            <Th textAlign='right'>Users</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rooms.map((room) => (
            <RoomLItem roomName={room.roomName} owner={room.owner} users={room.users} roomId={room.roomId} handleJoin={handleJoin} />
          ))}
        </Tbody>
      </Table>

    </Box>
  );
};

export { RoomList };