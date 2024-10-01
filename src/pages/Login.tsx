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
  const [isSessionActive, setIsSessionActive] = useState(false); // Track if a session is active
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Check if there is an active session on page load
  useEffect(() => {
    if (user) {
      setIsSessionActive(true); // If user exists, session is active
      onOpen(); // Open modal to inform the user immediately after the page loads
    }
  }, [user, onOpen]);

  // Handle form submission for login with debounce to prevent rapid multiple submissions
  const onSubmit = debounce(async (data) => {
    try {
      const loggedInUser = await login(data.email, data.password); // Now login returns the User object
      const userName = loggedInUser?.name || 'User'; // Safely get the user's name or use "User" as a fallback
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userName}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsSessionActive(true); // Disable form after successful login
      onOpen(); // Show modal after login
      reset(); // Reset form fields after successful login
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, 300);

  return (
    <Box width="100%" maxW="md" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.email} isDisabled={isSessionActive}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              isDisabled={isSessionActive} // Disable if session is active
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!errors.password}
            isDisabled={isSessionActive}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              isDisabled={isSessionActive} // Disable if session is active
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
            isDisabled={isSessionActive} // Disable if session is active
          >
            Log In
          </Button>
        </VStack>
      </form>

      {/* Modal to inform user about active session */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Active Session Detected</ModalHeader>
          <ModalBody>
            You are already logged in. Please log out first before you continue.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
