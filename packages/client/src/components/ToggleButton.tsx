import * as React from 'react';
import { useToggle } from '../hooks/useToggle';

type ToggleButtonProps = {
  ref: any
};

const ToggleButton = ({ }: ToggleButtonProps) => {
  const [toggle, setToggle] = useToggle(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setToggle();
  };

  return (
    <div>
      <button onClick={handleClick}>toggle private</button>
      {toggle ? <p>private</p> : <p>public</p>}
    </div>

  );

};

export { ToggleButton };