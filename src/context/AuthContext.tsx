import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { account, ID, Models } from '../appwriteConfig';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  triggerLoginSuccess,
  triggerLoginFailure,
  triggerSessionInactive,
} from '../utils/message';

interface AuthContextProps {
  user: Models.User<Models.Preferences> | null;
  isAuthenticated: boolean;
  register: (
    fullName: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<Models.User<Models.Preferences>>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  /**
   * Checks if a user session exists.
   * If a session exists and the user is verified, sets the user as authenticated.
   * If the user is not verified, navigates to the email verification page.
   */
  async function checkSession() {
    try {
      const currentSession = await account.getSession('current');
      const loggedInUser = await account.get();

      if (loggedInUser.emailVerification) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        navigate('/check-email');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  /**
   * Authenticates the user using their email and password.
   * Ensures the user's email is verified before granting access to protected routes.
   */
  async function login(
    email: string,
    password: string
  ): Promise<Models.User<Models.Preferences>> {
    try {
      toast({
        title: 'Logging In',
        description: 'Attempting to log in...',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      await account.createEmailPasswordSession(email, password);
      const loggedInUser = await account.get();

      if (loggedInUser.emailVerification) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        triggerLoginSuccess(toast, null, loggedInUser.name);
        return loggedInUser;
      } else {
        toast({
          title: 'Email Verification Required',
          description: 'Please verify your email to log in.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        throw new Error('Email not verified');
      }
    } catch (error) {
      triggerLoginFailure(toast, null);
      throw error;
    }
  }

  /**
   * Logs out the current user by ending their session.
   */
  async function logout() {
    try {
      await account.deleteSession('current');
      setUser(null);
      setIsAuthenticated(false);
      triggerSessionInactive(toast, null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Registers a new user, logs them in temporarily to set their name and role,
   * sends a verification email, and then logs them out.
   */
  async function register(
    fullName: string,
    email: string,
    password: string,
    role: string
  ) {
    try {
      toast({
        title: 'Registering User',
        description: `Creating account for ${fullName}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Step 1: Create a new user account with the provided email and password
      await account.create(ID.unique(), email, password);

      // Step 2: Log the user in temporarily to set name and preferences
      await account.createEmailPasswordSession(email, password);

      // Step 3: Update the user's profile with their full name and role
      await account.updateName(fullName);
      await account.updatePrefs({ role });

      // Step 4: Send verification email while user is still logged in
      await account.createVerification(`${window.location.origin}/verify`);

      // Step 5: Log the user out
      await logout();

      // Redirect to check email page
      navigate('/check-email');

      toast({
        title: 'Registration Successful',
        description: `Account created for ${fullName}. Please verify your email.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'An error occurred. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, register, login, logout, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
