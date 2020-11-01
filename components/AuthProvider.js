import nookies from 'nookies'
import { auth } from '../lib/firebase'
import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext({user: null});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
        console.log('Auth change: ' + !!user);
        if (!user) {
            setUser(null);
            nookies.set(undefined, 'token', '');
            return;
        }

        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, 'token', token);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{
      children
    }</AuthContext.Provider>
  );
}