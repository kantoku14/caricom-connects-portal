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
   * login function:
   * - Takes an email and password.
   * - Attempts to log in using Appwrite's email/password session method.
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
      throw error; // Re-throw the error for the UI to catch and display
    }
  };

  /**
   * logout function:
   * - Deletes the current session (logs the user out).
   * - Sets the `user` state to null after logout.
   */
  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
    console.log('User successfully logged out.');
  };

  /**
   * register function:
   * - Takes fullName, email, password, and role as parameters.
   * - Registers a new user using Appwrite's create method with a unique ID.
   * - Updates the user's name and preferences (fullName and role).
   * - Logs in the user after successful registration.
   */
  const register = async (fullName, email, password, role) => {
    try {
      // Create a new user with a unique ID
      const newUser = await account.create(ID.unique(), email, password);
      console.log('User successfully created:', newUser);

      // Log in the user after registration
      await login(email, password);

      // Update the user's full name using account.updateName()
      await account.updateName(fullName);
      console.log('Full name successfully updated.');

      // Update the user's role and other preferences using account.updatePrefs()
      await account.updatePrefs({ role });
      console.log('User role successfully updated.');
    } catch (error) {
      console.error('Registration Error:', error);
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

  /**
   * useEffect:
   * - Runs once when the component mounts.
   * - Calls the `init` function to check if the user is already logged in when the app loads.
   */
  useEffect(() => {
    init();
  }, []);

  // Provide the user state and authentication functions (login, logout, register) to the components wrapped by the AuthProvider.
  return (
    <AuthContext.Provider value={{ current: user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
