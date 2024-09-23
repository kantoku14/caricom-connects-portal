import { ID } from 'appwrite';
import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../appwriteConfig'; // Import the configured Appwrite account object

// Create a context for user-related data and functions
export const AuthContext = createContext();

// Custom hook to allow components to easily access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the part of the app where you want user data and authentication available
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * register function:
   * - Registers a new user using Appwrite's create method with a unique ID.
   * - Logs in the user after successful registration using `createEmailPasswordSession`.
   */
  const register = async (email, password) => {
    try {
      // Create a new user with a unique ID, email, and password
      const newUser = await account.create(ID.unique(), email, password);
      console.log('User successfully created:', newUser);

      // Log in the user after registration
      await login(email, password);
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  };

  /**
   * login function:
   * - Takes an email and password.
   * - Logs the user in using Appwrite's `createEmailPasswordSession` method.
   * - Updates the `user` state with the logged-in user data.
   */
  const login = async (email, password) => {
    try {
      const loggedIn = await account.createEmailPasswordSession(
        email,
        password
      ); // Use createEmailPasswordSession for login
      setUser(loggedIn);
      console.log('User successfully logged in:', loggedIn);
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  /**
   * init function:
   * - Called on component mount to check if a user is already logged in.
   * - Attempts to retrieve the current session using Appwrite's `account.get()` method.
   * - If a session exists, the user state is updated; otherwise, the user is set to null.
   */
  const init = async () => {
    try {
      const loggedIn = await account.get(); // Try to fetch the current session
      setUser(loggedIn);
      console.log('Session found:', loggedIn);
    } catch (err) {
      setUser(null); // If no session is found or an error occurs, set user to null
      console.log('No session found.');
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ current: user, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};
