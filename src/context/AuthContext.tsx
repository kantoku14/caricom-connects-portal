// Import necessary modules and functions from Appwrite and React libraries
import { ID } from 'appwrite'; // 'ID' is used to generate unique IDs for user registration
import { createContext, useContext, useEffect, useState } from 'react'; // React hooks for managing context and state
import { account } from '../appwriteConfig'; // Import the configured Appwrite account object

// Create a context for user-related data and functions
const UserContext = createContext();

// Custom hook to allow components to easily access the user context
export function useUser() {
  return useContext(UserContext); // Returns the current value of the UserContext
}

// Provider component that wraps the part of the app where you want user data and authentication available
export function UserProvider(props) {
  // State to hold the current logged-in user, initialized as null
  const [user, setUser] = useState(null);

  /**
   * login function:
   * - Takes an email and password.
   * - Attempts to log in using Appwrite's email/password session method.
   * - Updates the `user` state with the logged-in user data.
   * - Redirects the user to the home page after a successful login (you can customize this redirect).
   */
  async function login(email, password) {
    const loggedIn = await account.createEmailPasswordSession(email, password); // Logs the user in
    setUser(loggedIn); // Update state with logged-in user data
    window.location.replace('/'); // Redirect to the home page (customizable)
  }

  /**
   * logout function:
   * - Deletes the current session (logs the user out).
   * - Sets the `user` state to null after logout.
   */
  async function logout() {
    await account.deleteSession('current'); // Ends the current session
    setUser(null); // Clear the user data
  }

  /**
   * register function:
   * - Takes an email and password.
   * - Registers a new user using Appwrite's create method with a unique ID.
   * - Automatically logs in the newly registered user after a successful registration.
   */
  async function register(email, password) {
    await account.create(ID.unique(), email, password); // Creates a new user with a unique ID
    await login(email, password); // Logs in the user automatically after registration
  }

  /**
   * init function:
   * - Called on component mount to check if a user is already logged in.
   * - Attempts to retrieve the current session using Appwrite's `account.get()` method.
   * - If a session exists, the user state is updated; otherwise, the user is set to null.
   */
  async function init() {
    try {
      const loggedIn = await account.get(); // Try to fetch the current session
      setUser(loggedIn); // If a session is found, set the user state
    } catch (err) {
      setUser(null); // If no session is found or an error occurs, set user to null
    }
  }

  /**
   * useEffect:
   * - Runs once when the component mounts (due to the empty dependency array).
   * - Calls the `init` function to check if the user is already logged in when the app loads.
   */
  useEffect(() => {
    init();
  }, []); // Empty array ensures this runs only once after the initial render

  // The UserContext.Provider provides the user state and authentication functions (login, logout, register)
  // to the components wrapped by the UserProvider.
  return (
    <UserContext.Provider value={{ current: user, login, logout, register }}>
      {props.children}{' '}
      {/* Render any child components wrapped in this provider */}
    </UserContext.Provider>
  );
}
