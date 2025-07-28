import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  signIn: async () => {},
  signOut: async () => {},
  userToken: null,
  userData: null,
});

export const useAuth = () => useContext(AuthContext);