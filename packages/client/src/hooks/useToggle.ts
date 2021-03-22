import * as React from 'react';

const useToggle = (initialState: boolean): [boolean, () => void] => {
  const [toggled, setToggled] = React.useState<boolean>(initialState);


  const toggle = React.useCallback(
    () => setToggled((state) => !state),
    [setToggled]
  );

  return [toggled, toggle];
};

export { useToggle };