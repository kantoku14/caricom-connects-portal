import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from 'react';
import { account } from '../appwriteConfig'; // Import Appwrite's account instance

// Define the types for your context
interface AuthContextType {
  user: any | null; // You can replace 'any' with a more specific type if needed
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  // Check for an active session on component mount
  const checkSession = async () => {
    try {
      const currentSession = await account.get(); // Get session information from Appwrite
      setUser(currentSession);
      console.log('Active session found. User is logged in:', currentSession);
    } catch (error) {
      console.log('No active session found. Error:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession(); // Check for session when component is mounted
  }, []);

  // Login function using Appwrite's account API with createEmailPasswordSession
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const session = await account.createEmailPasswordSession(email, password); // Create session
      setUser(session);
      console.log('User logged in:', session);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Register function using Appwrite's account API
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      await account.create('unique()', email, password, name); // Create user account
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
