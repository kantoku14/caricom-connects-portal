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
      loginSuccess: (name: string): Message => ({
        title: `Welcome back, ${name}`,
        description: 'You have logged in successfully.',
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
  
      registrationSuccess: (): Message => ({
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
        status: 'success',
        toast: true,
        log: true,
      }),
  
      registrationFailure: (): Message => ({
        title: 'Registration Failed',
        description: 'There was an error creating your account. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      }),
  
      passwordResetSuccess: (): Message => ({
        title: 'Password Reset Successful',
        description: 'Your password has been reset successfully.',
        status: 'success',
        toast: true,
        log: true,
      }),
  
      passwordResetFailure: (): Message => ({
        title: 'Password Reset Failed',
        description: 'There was an error resetting your password. Please try again.',
        status: 'error',
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
  
    // Account Actions Context
    account: {
      deactivateWarning: (): Message => ({
        title: 'Are you sure?',
        description: 'Deactivating your account will permanently remove access to all your data.',
        status: 'warning',
        modal: true,
        log: true,
      }),
  
      deactivateSuccess: (): Message => ({
        title: 'Account Deactivated',
        description: 'Your account has been deactivated successfully.',
        status: 'success',
        toast: true,
        log: true,
      }),
  
      deactivateFailure: (): Message => ({
        title: 'Deactivation Failed',
        description: 'There was an error deactivating your account. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      }),
    },
  
    // General System Context
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
  
      operationSuccess: (): Message => ({
        title: 'Operation Successful',
        description: 'The operation was completed successfully.',
        status: 'success',
        toast: true,
        log: true,
      }),
  
      operationFailure: (): Message => ({
        title: 'Operation Failed',
        description: 'There was an issue completing the operation. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      }),
    },
  
    // Data Management Context
    data: {
      saveSuccess: (): Message => ({
        title: 'Data Saved',
        description: 'Your data has been saved successfully.',
        status: 'success',
        toast: true,
        log: true,
      }),
  
      saveFailure: (): Message => ({
        title: 'Data Save Failed',
        description: 'There was an error saving your data. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      }),
  
      deleteSuccess: (): Message => ({
        title: 'Data Deleted',
        description: 'Your data has been deleted successfully.',
        status: 'success',
        toast: true,
        log: true,
      }),
  
      deleteFailure: (): Message => ({
        title: 'Data Deletion Failed',
        description: 'There was an error deleting your data. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      }),
    },
  
    // Payment & Transaction Context
    payment: {
      paymentSuccess: (): Message => ({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
        status: 'success',
        toast: true,
        log: true,
      }),
  
      paymentFailure: (): Message => ({
        title: 'Payment Failed',
        description: 'There was an issue processing your payment. Please try again.',
        status: 'error',
        toast: true,
        log: true,
      }),
  
      insufficientFunds: (): Message => ({
        title: 'Insufficient Funds',
        description: 'You do not have enough funds to complete this transaction.',
        status: 'warning',
        toast: true,
        log: true,
      }),
    },
  };
  