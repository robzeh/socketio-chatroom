interface User {
  username: string,
  sessionId: string,
  roomId: string
};

interface UserContextType {
  userDetails: User,
  setUserDetails: (userDetails: User) => void;
};

export type { User, UserContextType };