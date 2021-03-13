interface User {
  username: string,
  sessionId: number | null,
  roomId: string
};

interface UserContextType {
  userDetails: User,
  setUserDetails: (userDetails: User) => void;
};

export type { User, UserContextType };