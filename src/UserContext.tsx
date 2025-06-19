import React, { createContext, useState, useMemo } from 'react';
import { User } from './models/user';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

type ProviderProps = React.PropsWithChildren<unknown>;

export const UserContext = createContext<UserContextType>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
});

function UserProvider({ children }: ProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
