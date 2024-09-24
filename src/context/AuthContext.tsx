import { createContext, useContext, useState } from 'react';
import { account, ID } from '../appwriteConfig'; // Ensure ID is imported from Appwrite for user creation
import { useToast } from '@chakra-ui/react'; // Importing Chakra UI's toast for notifications

// Creating an authentication context to provide authentication functions and user data across the app
export const AuthContext = createContext();

// Custom hook to access the AuthContext, simplifying usage in components
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component: Wraps around the application and provides authentication-related methods and user data
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold the currently logged-in user
  const toast = useToast(); // Chakra UI's toast for showing feedback to the user

  // Login function: Authenticates the user using Appwrite's email/password method
  async function login(email, password) {
    try {
      // Attempt to log in the user using email and password
      const loggedIn = await account.createEmailPasswordSession(
        email,
        password
      );
      setUser(loggedIn); // Set the logged-in user's data to the state
      // Show success message to the user using Chakra UI toast
      toast({
        title: 'Login Successful',
        description: `Welcome back!`,
        status: 'success',
        duration: 5000, // Duration in milliseconds the toast will be displayed
        isClosable: true, // User can close the toast manually
      });
    } catch (error) {
      // Show error message if login fails (e.g., wrong credentials)
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Throw the error to be caught if needed by the calling function
      throw error;
    }
  }

  // Register function: Handles user registration, logging them in, and updating user details like name and role
  async function register(fullName, email, password, role) {
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
      await login(email, password);

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
      // Handle error if there's an ongoing session during registration
      if (error.message.includes('Session in progress')) {
        // If a session is already in progress, prompt the user to log out first
        toast({
          title: 'Session in Progress',
          description: 'You are already logged in. Please log out first.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // General error handling for any other registration failures
        toast({
          title: 'Registration Failed',
          description: 'An error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      // Throw the error to ensure it's caught by the calling function or logged elsewhere
      throw error;
    }
  }

  // Providing the register and login functions via AuthContext, making them available to all child components
  return (
    <AuthContext.Provider value={{ user, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};
