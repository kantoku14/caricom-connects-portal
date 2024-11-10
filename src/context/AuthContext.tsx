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
} from '../utils/message';
import { useNavigate } from 'react-router-dom'; // Import for navigation

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Check for an active session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  // Checks if a session exists and if the email is verified
  async function checkSession() {
    try {
      const currentSession = await account.getSession('current');
      const loggedInUser = await account.get();

      // Check if the user's email is verified
      if (loggedInUser.emailVerification) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        console.log('Active session found. User is logged in:', loggedInUser);
      } else {
        setIsAuthenticated(false);
        navigate('/check-email'); // Redirect to check email page if not verified
      }
    } catch (error) {
      console.log('No active session found.');
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  // Handles user login and checks email verification
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

      // Check if the user's email is verified
      if (loggedInUser.emailVerification) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        triggerLoginSuccess(toast, null, loggedInUser.name); // Notify success
        return loggedInUser;
      } else {
        setIsAuthenticated(false);
        navigate('/check-email'); // Redirect if not verified
        throw new Error('Email not verified');
      }
    } catch (error) {
      triggerLoginFailure(toast, null);
      throw error;
    }
  }

  // Handles user logout
  async function logout() {
    try {
      await account.deleteSession('current');
      setUser(null);
      setIsAuthenticated(false);

      triggerSessionInactive(toast, null);
      localStorage.removeItem('user'); // Clear locally stored data if implemented
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Handles user registration and initial login
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

      await account.create(ID.unique(), email, password);
      await login(email, password); // Attempt to login post-registration

      await account.updateName(fullName);
      await account.updatePrefs({ role });

      toast({
        title: 'Registration Successful',
        description: `Account created for ${fullName}. Please verify your email to proceed.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/check-email'); // Redirect to check email page after registration
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
