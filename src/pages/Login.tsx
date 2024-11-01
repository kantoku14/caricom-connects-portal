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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import {
  triggerLoginSuccess,
  triggerLoginFailure,
  triggerSessionActive,
} from '../utils/message'; // Import predefined message triggers

// Validation schema using Zod for login
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8+ characters' }),
});

export const Login = () => {
  const { login, user } = useAuth(); // Access login and user from AuthContext
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
  const [isSessionActive, setIsSessionActive] = useState(false); // Track if a session is active

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Check for an active session on component load
  useEffect(() => {
    if (user) {
      setIsSessionActive(true);
      triggerSessionActive(toast, onOpen, user.name); // Show session active message
    }
  }, [user, onOpen]);

  // Handle form submission for login
  const onSubmit = async (data) => {
    try {
      const loggedInUser = await login(data.email, data.password);
      const userName = loggedInUser?.name || 'User';
      triggerLoginSuccess(toast, onOpen, userName); // Use predefined message trigger for successful login
      setIsSessionActive(true); // Disable form after successful login
      reset(); // Reset form fields
    } catch (error) {
      triggerLoginFailure(toast, null); // Use predefined message trigger for login failure
    }
  };

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
