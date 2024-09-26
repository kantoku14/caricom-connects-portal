import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  FormErrorMessage,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { debounce } from 'lodash'; // Import debounce function

// Validation schema using Zod for login
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8+ characters' }),
});

export const Login = () => {
  const { login, user } = useAuth(); // Access login and user from AuthContext
  const toast = useToast();
  const [isSessionActive, setIsSessionActive] = useState(false); // Check if a session is active
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state control

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Check if there is an active session using the user state from AuthContext
  useEffect(() => {
    if (user) {
      setIsSessionActive(true); // If user exists, session is active
      onOpen(); // Open modal to inform the user
    }
  }, [user]);

  // Handle form submission for login with debounce to prevent rapid multiple submissions
  const onSubmit = debounce(async (data) => {
    try {
      const loggedInUser = await login(data.email, data.password); // Now login returns the User object
      const userName = loggedInUser?.name || 'User'; // Safely get the user's name or use "User" as a fallback
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userName}!`, // Welcoming the user by their name
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      reset();
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Error).message === 'string'
      ) {
        if ((error as Error).message.includes('Rate limit')) {
          toast({
            title: 'Too Many Requests',
            description:
              'You are making too many requests. Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Login Failed',
            description: 'Please check your credentials and try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
      console.error('Error during login:', error);
    }
  }, 500); // Debounce time in milliseconds (500ms)

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      {/* Modal to inform the user about the active session */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Active Session Detected</ModalHeader>
          <ModalBody>
            You are already logged in. Please log out first to log into a new
            account.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          {/* Email Input */}
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              autoComplete="email" // Add autocomplete attribute
              isDisabled={isSessionActive} // Disable if session is active
            />
            <FormErrorMessage>
              {typeof errors.email?.message === 'string'
                ? errors.email.message
                : null}
            </FormErrorMessage>
          </FormControl>

          {/* Password Input */}
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              autoComplete="current-password" // Add autocomplete attribute
              isDisabled={isSessionActive} // Disable if session is active
            />
            <FormErrorMessage>
              {typeof errors.password?.message === 'string'
                ? errors.password.message
                : null}
            </FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
            isDisabled={isSessionActive} // Disable button if session is active
          >
            Log In
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
