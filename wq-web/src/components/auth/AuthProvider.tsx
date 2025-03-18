import React, {createContext, useEffect, useState} from 'react';
import {User} from './types/User';
import {AuthContextType} from './types/AuthContextType';
import {AuthProviderProps} from './types/AuthProviderProps.ts';
import SessionExpiredDialog from '../../pages/Common/DialogBoxes/SessionExpiredDialog.tsx';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return true;
    return Date.now() > parseInt(expirationTime, 10);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && !isTokenExpired()) {
      setToken(storedToken);
      setIsUserLoggedIn(true);
    } else if (storedToken) {
      logout('tokenExpired', false);
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUserData();

    const tokenCheckInterval = setInterval(() => {
      console.log('Checking token expiration: ', isUserLoggedIn);
      if (isTokenExpired() && isUserLoggedIn) {
        setIsLoading(true);

        setTimeout(() => {
          logout('tokenExpired');
          setIsLoading(false);
        }, 2000);
      }
    }, 60000);

    return () => clearInterval(tokenCheckInterval);
  }, [isUserLoggedIn]);

  useEffect(() => {
    console.log('User login state has changed: ', isUserLoggedIn);
  }, [isUserLoggedIn]);

  const login = (userData: User, headerToken: string, timeout: number) => {
    console.log('here at auth provider');
    const expirationTime = Date.now() + timeout * 60 * 1000;
    setUser(userData);
    setToken(headerToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);
    localStorage.setItem('token', headerToken);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    setIsUserLoggedIn(true);
  };

  const setHeader = (headerToken: string) => {
    setToken(headerToken);
    localStorage.setItem('token', headerToken);
    console.log('Token set:', headerToken);
  };

  const logout = (reason: string | null = null, showDialog: boolean = true) => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('role');
    console.log('User logged out');

    setLogoutReason(reason);
    if (reason === 'tokenExpired' && showDialog) {
      setDialogOpen(true);
    }
    setIsUserLoggedIn(false);
  };

  const handleDialogClose = () => {
    setLogoutReason(null);
    setDialogOpen(false);
    setIsUserLoggedIn(false);
    console.log(logoutReason);
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          token,
          isLoading,
          login,
          logout,
          setHeader,
          isTokenExpired,
          setIsLoading
        }}
      >
        {children}
      </AuthContext.Provider>
      <SessionExpiredDialog open={dialogOpen} onClose={handleDialogClose} />
    </>
  );
};
