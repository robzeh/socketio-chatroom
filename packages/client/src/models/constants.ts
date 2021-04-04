const INITIAL_USER_DETAILS = {
  username: '',
  sessionId: '',
  roomId: '',
  userId: '',
  color: '',
  roomOwner: false,
};

const INITIAL_ROOM_STATE = {
  roomName: '',
  users: 0,
  ready: 0,
  roomOwner: '',
};

const INITIAL_MANGA_STATE = {
  pages: [], // Blob type?
  page: undefined,
  currPage: 0
};

export { INITIAL_USER_DETAILS, INITIAL_ROOM_STATE, INITIAL_MANGA_STATE };