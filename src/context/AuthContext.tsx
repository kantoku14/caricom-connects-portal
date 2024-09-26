import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { account, ID, Models } from '../appwriteConfig'; // Ensure ID and Models are imported from Appwrite
import { useToast } from '@chakra-ui/react'; // Importing Chakra UI's toast for notifications

// Define the user and context types
interface AuthContextProps {
  user: Models.User<Models.Preferences> | null;
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
  checkSession: () => Promise<void>;
}

// Creating an authentication context to provide authentication functions and user data across the app
export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

// Custom hook to access the AuthContext, simplifying usage in components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component: Wraps around the application and provides authentication-related methods and user data
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  ); // State to hold the currently logged-in user or null if no session exists
  const toast = useToast(); // Chakra UI's toast for showing feedback to the user

  // Function to check if a session exists on app load or page refresh
  async function checkSession() {
    try {
      // Step 1: Check if a session exists
      const currentSession = await account.getSession('current'); // Get the current session information

      // Step 2: If a session exists, fetch the user details
      const loggedInUser = await account.get(); // Get the user details
      setUser(loggedInUser); // Set the user data to the state

      console.log('Active session found. User is logged in:', loggedInUser); // Log when a session is active
    } catch (error) {
      console.log('No active session found. User is not logged in.');
      setUser(null); // No session means no user
    }
  }

  // **Login function**: Handles user login and returns the logged-in user
  async function login(
    email: string,
    password: string
  ): Promise<Models.User<Models.Preferences>> {
    try {
      // Notify the user that the login process has started
      toast({
        title: 'Logging In',
        description: 'Attempting to log in...',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Step 1: Authenticate the user with email and password
      await account.createEmailPasswordSession(email, password);

      // Step 2: Fetch the logged-in user's details
      const loggedInUser = await account.get();

      // Step 3: Set the user data to the state
      setUser(loggedInUser);

      // Notify the user of successful login
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${loggedInUser.name}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Return the logged-in user
      return loggedInUser;
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      throw error; // Re-throw error to handle it in the calling code
    }
  }

  // Register function: Handles user registration, logging them in, and updating user details like name and role
  async function register(
    fullName: string,
    email: string,
    password: string,
    role: string
  ) {
    try {
      // Notify the user that the registration process has started
      toast({
        title: 'Registering User',
        description: `Creating account for ${fullName}`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Step 1: Create a new user account with the provided email and password
      await account.create(ID.unique(), email, password);

      // Step 2: Log the user in immediately after successful account creation
      const loggedInUser = await login(email, password);

      // Step 3: Update the user's profile with their full name and role
      await account.updateName(fullName); // Update user's full name
      await account.updatePrefs({ role }); // Update user's role (Buyer/Seller)

      // Notify the user of successful registration and login
      toast({
        title: 'Registration Successful',
        description: `Account created for ${fullName}. You are logged in as a ${role}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Registration Failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }

  // Providing the user state, register, login, and session check functions via AuthContext
  return (
    <AuthContext.Provider value={{ user, register, login, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};
