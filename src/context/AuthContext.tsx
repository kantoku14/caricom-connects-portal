import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { account, ID, Models } from '../appwriteConfig';
import { useToast } from '@chakra-ui/react';
import {
  triggerLoginSuccess,
  triggerLoginFailure,
  triggerSessionInactive,
} from '../utils/message'; // Import trigger functions from message.ts

// Define the context properties, adding isAuthenticated to track login state
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

// Create AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

// Custom hook to access AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component for managing authentication state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status
  const toast = useToast();

  // Check for an active session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  /**
   * Checks if a session exists and sets the user and isAuthenticated state accordingly.
   */
  async function checkSession() {
    try {
      const currentSession = await account.getSession('current');
      const loggedInUser = await account.get();
      setUser(loggedInUser);
      setIsAuthenticated(true);
      console.log('Active session found. User is logged in:', loggedInUser);
    } catch (error) {
      console.log('No active session found.');
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  /**
   * Handles user login, sets session state, and triggers success/failure messages.
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

      await account.createEmailPasswordSession(email, password); // Authenticates user
      const loggedInUser = await account.get(); // Gets user details
      setUser(loggedInUser);
      setIsAuthenticated(true);

      triggerLoginSuccess(toast, null, loggedInUser.name); // Notify success
      return loggedInUser;
    } catch (error) {
      triggerLoginFailure(toast, null); // Notify failure
      throw error;
    }
  }

  /**
   * Handles user logout, clears session, and triggers session inactive notification.
   */
  async function logout() {
    try {
      await account.deleteSession('current'); // Ends the current session
      setUser(null);
      setIsAuthenticated(false);

      triggerSessionInactive(toast, null); // Notify user of session inactive

      // Clear any locally stored user data if "Remember Me" is implemented
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error); // Log any errors
    }
  }

  /**
   * Handles new user registration and logs them in.
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

      await account.create(ID.unique(), email, password); // Register user
      await login(email, password); // Auto-login after registration

      await account.updateName(fullName); // Set user's full name
      await account.updatePrefs({ role }); // Set user's role

      toast({
        title: 'Registration Successful',
        description: `Account created for ${fullName}. You are logged in as a ${role}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
