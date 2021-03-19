import * as React from 'react';
import { RoomUser } from '../types';

type UserProps = {
  details: RoomUser
};

const User = ({ details }: UserProps) => {

  return (
    <p>{details.username} #{details.userId}: {details.color}</p>
  );

};

export { User };