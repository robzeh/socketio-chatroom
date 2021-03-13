import * as React from 'react';

type ChooseProps = {
  handleCreate: (event: React.FormEvent<HTMLFormElement>) => void,
  handleJoin: (event: React.FormEvent<HTMLFormElement>) => void
};

const Choose = React.forwardRef(({ handleCreate, handleJoin }: ChooseProps, ref: React.Ref<HTMLInputElement>) => {

  return (
    <div>
      <form onSubmit={handleCreate}>
        <button type='submit'>Create Room</button>
      </form>
      <form onSubmit={handleJoin}>
        <button type='submit'>Join Room</button>
        <input type='text' ref={ref} />
      </form>
    </div>
  );

});

export { Choose };
