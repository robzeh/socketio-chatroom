import { redis, roomStore, roomUserStore, sessionStore } from '../stores/stores';

// clear database
beforeAll((done) => {
  redis.flushall(done);
});

// close redis connection
afterAll((done) => {
  redis.disconnect();
  done();
});

// session store
describe('session store', () => {

  // save session
  test('save session', async (done) => {
    sessionStore.saveSession('1234', {
      username: 'robie',
      roomId: 'room'
    });

    const res = await sessionStore.findSession('1234');
    expect(res).toEqual({
      username: 'robie',
      roomId: 'room'
    });
    done();
  });

  // update session
  test('update session', async (done) => {
    sessionStore.saveSession('1234', {
      username: 'new robie',
      roomId: 'new room'
    });

    const res = await sessionStore.findSession('1234');
    expect(res).toEqual({
      username: 'new robie',
      roomId: 'new room'
    });
    done();
  });

  // find empty session
  test('non existing session', async (done) => {
    const res = await sessionStore.findSession('0');
    expect(res).toEqual({
      username: null,
      roomId: null
    });
    done();
  });

});

// room store
describe('room store', () => {

  // save room
  test('save room and check existence', async (done) => {
    roomStore.saveRoom('123', 'robie');

    const res = await roomStore.findRoom('123');
    expect(res).toBe(1);
    done();
  });

  // TODO: combine?
  test('get room owner', async (done) => {
    const res = await roomStore.getRoomOwner('123');
    expect(res).toEqual(['robie']);
    done();
  });

  // update room
  test('update room', async (done) => {
    roomStore.saveRoom('123', 'new robie');

    const res = await roomStore.getRoomOwner('123');
    expect(res).toEqual(['new robie']);
    done();
  });

  // remove room
  test('remove room', async (done) => {
    roomStore.removeRoom('123');

    const res = await roomStore.findRoom('123');
    expect(res).toBe(0);
    done();
  });

  // non existing room
  test('non existing room', async (done) => {
    const res = await roomStore.findRoom('0');
    expect(res).toBe(0);
    done();
  });

});

// room user store
describe('room user store', () => {

  // save room user
  test('save room user', async (done) => {
    roomUserStore.saveRoomUser('123', 'robie');

    const res = await roomUserStore.isRoomUser('123', 'robie');
    expect(res).toBe(1);
    done();
  });

  // get all room users
  test('get all room users', async (done) => {
    roomUserStore.saveRoomUser('123', 'another robie');

    const res = await roomUserStore.getAllRoomUsers('123');
    expect(res).toEqual(['robie', 'another robie']);
    done();
  })

  // remove room user
  test('remove room user', async (done) => {
    roomUserStore.removeRoomUser('123', 'robie');

    const res = await roomUserStore.getAllRoomUsers('123');
    expect(res).toEqual(['another robie']);
    done();
  });

  // remove room
  test('remove room', async (done) => {
    roomUserStore.removeRoom('123');

    const res = await roomUserStore.roomSize('123');
    expect(res).toBe(0);
    done();
  });

});
