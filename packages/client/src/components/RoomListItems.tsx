import * as React from 'react';
import { RoomListItem } from '../models/types';

const RoomItem = ({ roomName, owner, users }: RoomListItem) => {

  return (
    <div>
      <p>{roomName} hosted by {owner} with {users} users</p>
    </div>
  );

};

export { RoomItem };