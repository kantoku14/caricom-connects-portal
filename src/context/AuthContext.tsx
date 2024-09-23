import { ID } from 'appwrite';
import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../appwriteConfig'; // Import the configured Appwrite account object

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * register function:
   * - Registers a new user using Appwrite's create method with a unique ID.
   * - Logs in the user after successful registration.
   * - Updates user's full name and preferences (role).
   */
  const register = async (fullName, email, password, role) => {
    try {
      // Create a new user with a unique ID, email, and password
      const newUser = await account.create(ID.unique(), email, password);
      console.log('User successfully created:', newUser);

      // Log in the user after registration
      await login(email, password);

      // Update the user's full name using account.updateName()
      await account.updateName(fullName);
      console.log('Full name successfully updated.');

      // Update the user's role using account.updatePrefs()
      await account.updatePrefs({ role });
      console.log('User role successfully updated.');
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  };

  /**
   * login function:
   * - Logs the user in using Appwrite's `createEmailPasswordSession` method.
   * - Updates the `user` state with the logged-in user data.
   */
  const login = async (email, password) => {
    try {
      const loggedIn = await account.createEmailPasswordSession(
        email,
        password
      );
      setUser(loggedIn);
      console.log('User successfully logged in:', loggedIn);
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const loggedIn = await account.get(); // Fetch the current session if available
        setUser(loggedIn);
        console.log('Session found:', loggedIn);
      } catch (err) {
        setUser(null);
        console.log('No session found.');
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ current: user, register, login }}>
      {children}
    </AuthContext.Provider>
  );
};
