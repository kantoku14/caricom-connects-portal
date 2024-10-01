import { useToast } from '@chakra-ui/react';
import { showMessage } from './messageHandler'; // Assuming you have a message handler
import { Message } from './types'; // Assuming you have defined a Message type

// Define the structure of each message
export const messages = {
  // Authentication Context
  auth: {
    loginSuccess: (name: string, location: string): Message => ({
      title: `Welcome back, ${name}`,
      description: `You have logged in successfully from ${location}.`,
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
    logoutSuccess: (name: string): Message => ({
      title: `Goodbye, ${name}`,
      description: 'You have logged out successfully.',
      status: 'info',
      toast: true,
      log: true,
    }),
    sessionActive: (name: string): Message => ({
      title: `Session Active`,
      description: `${name} is currently logged in.`,
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
  },

  // Form Validation Context for Login and Register
  form: {
    invalidInput: (field: string): Message => ({
      title: 'Invalid Input',
      description: `The ${field} you entered is invalid. Please try again.`,
      status: 'error',
      toast: true,
      log: true,
    }),
    requiredField: (field: string): Message => ({
      title: 'Required Field',
      description: `The ${field} is required.`,
      status: 'warning',
      toast: true,
      log: true,
    }),
    submissionSuccess: (): Message => ({
      title: 'Form Submitted',
      description: 'Your form has been submitted successfully.',
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
    passwordMismatch: (): Message => ({
      title: 'Password Mismatch',
      description: 'Passwords do not match. Please re-enter your password.',
      status: 'error',
      toast: true,
      log: true,
    }),
    emailFormatInvalid: (): Message => ({
      title: 'Invalid Email Format',
      description: 'Please enter a valid email address.',
      status: 'error',
      toast: true,
      log: true,
    }),
  },

  // Profile Update Context
  profile: {
    updateSuccess: (): Message => ({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
      status: 'success',
      toast: true,
      log: true,
    }),
    updateFailure: (): Message => ({
      title: 'Profile Update Failed',
      description:
        'There was an error updating your profile. Please try again.',
      status: 'error',
      toast: true,
      log: true,
    }),
  },

  // System Context
  system: {
    serverError: (): Message => ({
      title: 'Server Error',
      description: 'An unexpected error occurred. Please try again later.',
      status: 'error',
      modal: true,
      log: true,
    }),
    networkError: (): Message => ({
      title: 'Network Error',
      description:
        'Unable to connect to the server. Please check your internet connection.',
      status: 'error',
      toast: true,
      log: true,
    }),
  },
};

// Predefined Trigger Functions

// Authentication Triggers
export function triggerLoginSuccess(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>,
  name: string,
  location: string
) {
  const message = messages.auth.loginSuccess(name, location);
  showMessage(message, toast, setModalMessage);
}

export function triggerLoginFailure(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>
) {
  const message = messages.auth.loginFailure();
  showMessage(message, toast, setModalMessage);
}

export function triggerLogoutSuccess(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>,
  name: string
) {
  const message = messages.auth.logoutSuccess(name);
  showMessage(message, toast, setModalMessage);
}

export function triggerSessionActive(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>,
  name: string
) {
  const message = messages.auth.sessionActive(name);
  showMessage(message, toast, setModalMessage);
}

export function triggerSessionInactive(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>
) {
  const message = messages.auth.sessionInactive();
  showMessage(message, toast, setModalMessage);
}

// Form Triggers
export function triggerFormSubmissionSuccess(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>
) {
  const message = messages.form.submissionSuccess();
  showMessage(message, toast, setModalMessage);
}

export function triggerFormSubmissionError(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>
) {
  const message = messages.form.submissionError();
  showMessage(message, toast, setModalMessage);
}

// Profile Triggers
export function triggerProfileUpdateSuccess(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>
) {
  const message = messages.profile.updateSuccess();
  showMessage(message, toast, setModalMessage);
}

export function triggerProfileUpdateFailure(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>
) {
  const message = messages.profile.updateFailure();
  showMessage(message, toast, setModalMessage);
}

// System Triggers
export function triggerServerError(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>,
  onOpen: () => void
) {
  const message = messages.system.serverError();
  showMessage(message, toast, setModalMessage);
  onOpen(); // Opens the modal
}

export function triggerNetworkError(
  toast: ReturnType<typeof useToast>,
  setModalMessage: React.Dispatch<React.SetStateAction<Message | null>>
) {
  const message = messages.system.networkError();
  showMessage(message, toast, setModalMessage);
}
