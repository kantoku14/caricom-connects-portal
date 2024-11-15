import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { account, ID, Models, storage } from '../appwriteConfig';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  triggerLoginSuccess,
  triggerLoginFailure,
  triggerSessionInactive,
} from '../utils/message';

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
  updateUserPreferences: (
    newPreferences: Partial<Models.Preferences>
  ) => Promise<void>;
  updateUserAvatar: (file: File) => Promise<void>; // Function to upload avatar
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const currentSession = await account.getSession('current');
      const loggedInUser = await account.get();
      if (loggedInUser.emailVerification) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        navigate('/check-email');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }

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
      if (loggedInUser.emailVerification) {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        triggerLoginSuccess(toast, null, loggedInUser.name);
        return loggedInUser;
      } else {
        toast({
          title: 'Email Verification Required',
          description: 'Please verify your email to log in.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        throw new Error('Email not verified');
      }
    } catch (error) {
      triggerLoginFailure(toast, null);
      throw error;
    }
  }

  async function logout() {
    try {
      await account.deleteSession('current');
      setUser(null);
      setIsAuthenticated(false);
      triggerSessionInactive(toast, null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

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

      await account.createEmailPasswordSession(email, password);

      await account.updateName(fullName);
      await account.updatePrefs({ role });

      await account.createVerification(`${window.location.origin}/verify`);
      await logout();
      navigate('/check-email');

      toast({
        title: 'Registration Successful',
        description: `Account created for ${fullName}. Please verify your email.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'An error occurred. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  }

  async function updateUserPreferences(
    newPreferences: Partial<Models.Preferences>
  ) {
    try {
      const existingPrefs = user?.prefs || {};
      const updatedPrefs = { ...existingPrefs, ...newPreferences };
      await account.updatePrefs(updatedPrefs);

      setUser((prevUser) =>
        prevUser ? { ...prevUser, prefs: updatedPrefs } : prevUser
      );

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  async function updateUserAvatar(file: File) {
    console.log('Avatar upload initiated...');
    try {
      console.log('Uploading file to bucket...');
      const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID; // Vite environment variable
      if (!bucketId) {
        throw new Error('Bucket ID is not defined in environment variables.');
      }

      const uploadResponse = await storage.createFile(
        bucketId,
        ID.unique(),
        file
      );
      console.log('Upload response:', uploadResponse);

      const avatarUrl = storage.getFilePreview(bucketId, uploadResponse.$id);
      console.log('Generated avatar URL:', avatarUrl);

      console.log('Updating user preferences with new avatar URL...');
      await account.updatePrefs({ avatar: avatarUrl });

      console.log('User preferences updated successfully');
      setUser((prevUser) =>
        prevUser
          ? { ...prevUser, prefs: { ...prevUser.prefs, avatar: avatarUrl } }
          : prevUser
      );

      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during avatar upload:', error);
      toast({
        title: 'Avatar Update Failed',
        description:
          'An error occurred while updating your avatar. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        register,
        login,
        logout,
        checkSession,
        updateUserPreferences,
        updateUserAvatar, // Provide new function in context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
