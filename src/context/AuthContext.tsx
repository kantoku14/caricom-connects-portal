import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../appwriteConfig'; // Import Appwrite's account service

// Define types for AuthContext values
interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component wraps around the app and provides authentication functionality
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null); // State to hold the current authenticated user

  // On component mount, check if a user session exists
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await account.get(); // Attempt to get the current user session
        setUser(sessionUser); // If successful, set the user state
      } catch (error) {
        setUser(null); // If no session exists, set user to null
      }
    };
    checkSession(); // Run checkSession on component mount
  }, []);

  // Login function using email and password
  const login = async (email: string, password: string) => {
    try {
      await account.createEmailSession(email, password); // Create a session with email and password
      const sessionUser = await account.get(); // Fetch the user data after login
      setUser(sessionUser); // Set the user state
    } catch (error) {
      throw new Error('Login failed'); // Handle login errors
    }
  };

  // Logout function to clear the user session
  const logout = async () => {
    try {
      await account.deleteSession('current'); // Delete the current session
      setUser(null); // Clear the user state
    } catch (error) {
      throw new Error('Logout failed'); // Handle logout errors
    }
  };

  // Check session function to verify if a session exists and set the user accordingly
  const checkSession = async () => {
    try {
      const sessionUser = await account.get(); // Try to get current user session
      setUser(sessionUser); // Update user state if session exists
    } catch (error) {
      setUser(null); // Set user to null if session does not exist
    }
  };

  // Provide context value to children components
  return (
    <AuthContext.Provider value={{ user, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext values in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
