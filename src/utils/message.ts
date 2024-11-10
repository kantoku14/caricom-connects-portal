import { UseToastOptions, ToastId } from '@chakra-ui/react';
import { locale } from '../appwriteConfig'; // Import locale from Appwrite config

// Define the structure of each message
export interface Message {
  title: string;
  description: string;
  status: 'info' | 'warning' | 'success' | 'error';
  log?: boolean;
  toast?: boolean;
  modal?: boolean;
}

// Helper function to fetch user locale info
const fetchUserLocale = async (): Promise<string> => {
  try {
    const userLocale = await locale.get();
    return `${userLocale.country} (IP: ${userLocale.ip})`;
  } catch (error) {
    console.error('Error fetching user locale:', error);
    return 'unknown location';
  }
};

// Centralized messages object with grouped contexts
export const messages = {
  auth: {
    loginSuccess: async (name: string): Promise<Message> => ({
      title: `Welcome back, ${name}`,
      description: `You have logged in successfully from ${await fetchUserLocale()}.`,
      status: 'success',
      toast: true,
      log: true,
    }),
    loginFailure: (): Message => ({
      title: 'Login Failed',
      description: 'Invalid credentials. Please try again.',
      status: 'error',
      toast: true,
      log: true,
    }),
    logoutSuccess: async (name: string): Promise<Message> => ({
      title: `Goodbye, ${name}`,
      description: `You have logged out successfully from ${await fetchUserLocale()}.`,
      status: 'info',
      toast: true,
      log: true,
    }),
    sessionActive: async (name: string): Promise<Message> => ({
      title: 'Session Active',
      description: `${name} is currently logged in from ${await fetchUserLocale()}.`,
      status: 'info',
      toast: true,
      log: true,
    }),
    sessionInactive: (): Message => ({
      title: 'Session Inactive',
      description: 'No active session found. Please log in.',
      status: 'warning',
      toast: true,
      log: true,
    }),
    verificationSuccess: (): Message => ({
      title: 'Verification Successful',
      description: 'Your email has been verified. You can now log in.',
      status: 'success',
      toast: true,
      log: true,
    }),
    verificationFailure: (): Message => ({
      title: 'Verification Failed',
      description: 'Email verification failed. Please try again.',
      status: 'error',
      toast: true,
      log: true,
    }),
  },
  form: {
    submissionSuccess: async (): Promise<Message> => ({
      title: 'Form Submitted',
      description: `Your form has been submitted successfully from ${await fetchUserLocale()}.`,
      status: 'success',
      toast: true,
      log: true,
    }),
    submissionError: (): Message => ({
      title: 'Submission Failed',
      description: 'There was an error submitting your form. Please try again.',
      status: 'error',
      toast: true,
      log: true,
    }),
  },
};

// Predefined trigger functions for reusable scenarios
type SetModalMessage = (message: Message | null) => void;
type ToastFunction = (options: UseToastOptions) => ToastId;

export const triggerFormSubmissionSuccess = async (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null
) => {
  const message = await messages.form.submissionSuccess();
  toast(message);
  setModalMessage && setModalMessage(message);
};

export const triggerFormSubmissionError = (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null
) => {
  const message = messages.form.submissionError();
  toast(message);
  setModalMessage && setModalMessage(message);
};

export const triggerVerificationSuccess = (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null
) => {
  const message = messages.auth.verificationSuccess();
  toast(message);
  setModalMessage && setModalMessage(message);
};

export const triggerVerificationFailure = (
  toast: ToastFunction,
  setModalMessage: SetModalMessage | null
) => {
  const message = messages.auth.verificationFailure();
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
