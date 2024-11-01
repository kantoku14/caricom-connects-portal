import { UseToastOptions, ToastId } from '@chakra-ui/react';
import { locale } from '../appwriteConfig'; // Import Appwrite locale service

// Define the structure of each message
export interface Message {
  title: string;
  description: string;
  status: 'info' | 'warning' | 'success' | 'error';
  log?: boolean; // Optional: Whether to console.log the message
  toast?: boolean; // Optional: Whether to show a toast notification
  modal?: boolean; // Optional: Whether to show a modal
}

// Centralized messages object with grouped contexts
export const messages = {
  // Authentication Context
  auth: {
    async loginSuccess(name: string): Promise<Message> {
      const userLocale = await getUserLocale();
      return {
        title: `Welcome back, ${name}`,
        description: `You have logged in successfully from ${userLocale.country} (IP: ${userLocale.ip}).`,
        status: 'success',
        toast: true,
        log: true,
      };
    },

    loginFailure(): Message {
      return {
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      };
    },

    async logoutSuccess(name: string): Promise<Message> {
      const userLocale = await getUserLocale();
      return {
        title: `Goodbye, ${name}`,
        description: `You have logged out from ${userLocale.country}.`,
        status: 'info',
        toast: true,
        log: true,
      };
    },

    async sessionActive(name: string): Promise<Message> {
      const userLocale = await getUserLocale();
      return {
        title: 'Session Active',
        description: `${name} is currently logged in from ${userLocale.country} (IP: ${userLocale.ip}).`,
        status: 'info',
        toast: true,
        log: true,
      };
    },

    sessionInactive(): Message {
      return {
        title: 'Session Inactive',
        description: 'No active session found. Please log in.',
        status: 'warning',
        toast: true,
        log: true,
      };
    },
  },

  // Form Validation Context
  form: {
    invalidInput(field: string): Message {
      return {
        title: 'Invalid Input',
        description: `The ${field} you entered is invalid. Please try again.`,
        status: 'error',
        toast: true,
        log: true,
      };
    },

    requiredField(field: string): Message {
      return {
        title: 'Required Field',
        description: `The ${field} is required.`,
        status: 'warning',
        toast: true,
        log: true,
      };
    },

    submissionSuccess(): Message {
      return {
        title: 'Form Submitted',
        description: 'Your form has been submitted successfully.',
        status: 'success',
        toast: true,
        log: true,
      };
    },

    submissionError(): Message {
      return {
        title: 'Submission Failed',
        description: 'There was an error submitting your form. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      };
    },
  },

  // Profile Update Context
  profile: {
    updateSuccess(): Message {
      return {
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        toast: true,
        log: true,
      };
    },

    updateFailure(): Message {
      return {
        title: 'Profile Update Failed',
        description: 'There was an error updating your profile. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      };
    },
  },

  // System Context
  system: {
    serverError(): Message {
      return {
        title: 'Server Error',
        description: 'An unexpected error occurred. Please try again later.',
        status: 'error',
        modal: true,
        log: true,
      };
    },

    networkError(): Message {
      return {
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        status: 'error',
        toast: true,
        log: true,
      };
    },
  },
};

// Helper function to fetch user locale information
async function getUserLocale() {
  try {
    const userLocale = await locale.get();
    return {
      country: userLocale.country || 'Unknown Country',
      ip: userLocale.ip || 'Unknown IP',
    };
  } catch (error) {
    console.error('Error fetching user locale:', error);
    return { country: 'Unknown Country', ip: 'Unknown IP' };
  }
}

// Predefined trigger functions for reusable scenarios
type SetModalMessage = (message: Message | null) => void;
type ToastFunction = (options: UseToastOptions) => ToastId;

export const triggerLoginSuccess = async (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null,
  name: string
) => {
  const message = await messages.auth.loginSuccess(name);
  toast(message);
  setModalMessage && setModalMessage(message);
};

export const triggerLoginFailure = (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null
) => {
  const message = messages.auth.loginFailure();
  toast(message);
  setModalMessage && setModalMessage(message);
};

export const triggerLogoutSuccess = async (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null,
  name: string
) => {
  const message = await messages.auth.logoutSuccess(name);
  toast(message);
  setModalMessage && setModalMessage(message);
};

export const triggerSessionActive = async (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null,
  name: string
) => {
  const message = await messages.auth.sessionActive(name);
  toast(message);
  setModalMessage && setModalMessage(message);
};

export const triggerSessionInactive = (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null
) => {
  const message = messages.auth.sessionInactive();
  toast(message);
  setModalMessage && setModalMessage(message);
};
