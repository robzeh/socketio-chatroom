import { redis, roomStore, roomUserStore, sessionStore } from '../stores/stores';

// clear database
beforeAll((done) => {
  redis.flushall(done);
});

// close redis connection
afterAll(() => {
  redis.quit();
});

// session store
describe('session store', () => {

  // save session
  test('save session', async () => {
    sessionStore.saveSession('1234', {
      username: 'robie',
      roomId: 'room',
      userId: '1234',
      color: '#000000'
    });

    const res = await sessionStore.findSession('1234');
    expect(res).toEqual({
      username: 'robie',
      roomId: 'room',
      userId: '1234',
      color: '#000000'
    });
  });

  // update session
  test('update session', async () => {
    sessionStore.saveSession('1234', {
      username: 'new robie',
      roomId: 'new room',
      userId: '1234',
      color: '#FFFFFF'
    });

    const res = await sessionStore.findSession('1234');
    expect(res).toEqual({
      username: 'new robie',
      roomId: 'new room',
      userId: '1234',
      color: '#FFFFFF'
    });
  });

  // find empty session
  test('non existing session', async () => {
    const res = await sessionStore.findSession('0');
    expect(res).toEqual({
      username: null,
      roomId: null,
      userId: null,
      color: null
    });
  });

});

// TODO: tests for room name and private
// room store
describe('room store', () => {

  // save room
  test('save room and check existence', async () => {
    roomStore.saveRoom('123', 'robie', 'robies room', false);

    const res = await roomStore.findRoom('123');
    expect(res).toBe(1);
  });

  // TODO: combine?
  test('get room owner', async () => {
    const res = await roomStore.getRoomOwner('123');
    expect(res).toEqual(['robie']);
  });

  // update room
  test('update room', async () => {
    roomStore.saveRoom('123', 'new robie', 'new robies room', true);

    const res = await roomStore.getRoomOwner('123');
    expect(res).toEqual(['new robie']);
  });

  // remove room
  test('remove room', async () => {
    roomStore.removeRoom('123');

    const res = await roomStore.findRoom('123');
    expect(res).toBe(0);
  });

  // non existing room
  test('non existing room', async () => {
    const res = await roomStore.findRoom('0');
    expect(res).toBe(0);
  });

});

// room user store
describe('room user store', () => {

  // save room user
  test('save room user', async () => {
    roomUserStore.saveRoomUser('123', 'robie');

    const res = await roomUserStore.isRoomUser('123', 'robie');
    expect(res).toBe(1);
  });

  // get all room users
  test('get all room users', async () => {
    roomUserStore.saveRoomUser('123', 'another robie');

    const res = await roomUserStore.getAllRoomUsers('123');
    expect(res).toContain('robie');
    expect(res).toContain('another robie');
  })

  // remove room user
  test('remove room user', async () => {
    roomUserStore.removeRoomUser('123', 'robie');

    const res = await roomUserStore.getAllRoomUsers('123');
    expect(res).toEqual(['another robie']);
  });

  // remove room
  test('remove room', async () => {
    roomUserStore.removeRoom('123');

    const res = await roomUserStore.roomSize('123');
    expect(res).toBe(0);
  });

});
