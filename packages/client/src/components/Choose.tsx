import * as React from 'react';
import styled from 'styled-components';

type ChooseProps = {
  handleCreate: (event: React.FormEvent<HTMLFormElement>) => void,
  handleJoin: (event: React.FormEvent<HTMLFormElement>) => void
};

const Choose = React.forwardRef(({ handleCreate, handleJoin }: ChooseProps, ref: React.Ref<HTMLInputElement>) => {

  return (
    <Container>
      <FormContainer>
        <Card>
          <Form onSubmit={handleCreate}>
            <Button type='submit'>Create Room</Button>
          </Form>
        </Card>
        <Card>
          <Form onSubmit={handleJoin}>
            <Input type='text' ref={ref} placeholder='Room Code' />
            <Button type='submit'>Join Room</Button>
          </Form>
        </Card>
      </FormContainer>
    </Container>
  );

});

export { Choose };

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Form = styled.form`
  width: 50%;
`;

const Card = styled.div`
  width: 100%;
  min-height: 100px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border-radius: 3px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 320px;
  min-width: 200px;
  min-height: 95vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 769px) {
    flex-direction: row;
    max-width: 640px;
  }
`;

const Button = styled.button`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
`;
