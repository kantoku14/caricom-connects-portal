import { UseToastOptions, ToastId } from '@chakra-ui/react';

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
            title: 'Session Active',
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

    // Form Validation Context
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
            description: 'Passwords do not match. Please check and try again.',
            status: 'error',
            toast: true,
            log: true,
        }),

        emailFormatInvalid: (): Message => ({
            title: 'Invalid Email Format',
            description: 'The email address format is incorrect. Please enter a valid email.',
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
            description: 'There was an error updating your profile. Please try again.',
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
            description: 'Unable to connect to the server. Please check your internet connection.',
            status: 'error',
            toast: true,
            log: true,
        }),
    },
};

// Predefined trigger functions for reusable scenarios
type SetModalMessage = (message: Message | null) => void;
type ToastFunction = (options: UseToastOptions) => ToastId;

export const triggerLoginSuccess = (toast: ToastFunction, setModalMessage: SetModalMessage | null, name: string, location: string) => {
    const message = messages.auth.loginSuccess(name, location);
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerLoginFailure = (toast: ToastFunction, setModalMessage: SetModalMessage | null) => {
    const message = messages.auth.loginFailure();
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerLogoutSuccess = (toast: ToastFunction, setModalMessage: SetModalMessage | null, name: string) => {
    const message = messages.auth.logoutSuccess(name);
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerSessionActive = (toast: ToastFunction, setModalMessage: SetModalMessage | null, name: string) => {
    const message = messages.auth.sessionActive(name);
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerSessionInactive = (toast: ToastFunction, setModalMessage: SetModalMessage | null) => {
    const message = messages.auth.sessionInactive();
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerFormSubmissionSuccess = (toast: ToastFunction, setModalMessage: SetModalMessage | null) => {
    const message = messages.form.submissionSuccess();
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerFormSubmissionError = (toast: ToastFunction, setModalMessage: SetModalMessage | null) => {
    const message = messages.form.submissionError();
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerProfileUpdateSuccess = (toast: ToastFunction, setModalMessage: SetModalMessage | null) => {
    const message = messages.profile.updateSuccess();
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerProfileUpdateFailure = (toast: ToastFunction, setModalMessage: SetModalMessage | null) => {
    const message = messages.profile.updateFailure();
    toast(message);
    setModalMessage && setModalMessage(message);
};

export const triggerServerError = (toast: ToastFunction, setModalMessage: SetModalMessage | null, onOpen?: () => void) => {
    const message = messages.system.serverError();
    toast(message);
    setModalMessage && setModalMessage(message);
    onOpen && onOpen(); // Opens modal if defined
};

export const triggerNetworkError = (toast: ToastFunction, setModalMessage: SetModalMessage | null) => {
    const message = messages.system.networkError();
    toast(message);
    setModalMessage && setModalMessage(message);
};
