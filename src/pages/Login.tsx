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
  Checkbox,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { account, locale } from '../appwriteConfig';
import {
  triggerLoginSuccess,
  triggerLoginFailure,
  triggerSessionActive,
} from '../utils/message';
import { useNavigate } from 'react-router-dom';

// Validation schema using Zod for form validation
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8+ characters' }),
  rememberMe: z.boolean().optional(),
});

export const Login = () => {
  const { login, user, checkSession } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Watch rememberMe checkbox value
  const rememberMe = watch('rememberMe');

  useEffect(() => {
    const verifySession = async () => {
      const sessionUser = user || (await checkSession());
      if (sessionUser) {
        setIsSessionActive(true);
        triggerSessionActive(toast, onOpen, sessionUser.name);
        try {
          const userLocale = await locale.get();
          console.log("User's Locale Information:", userLocale);
          console.log(
            `User's Country: ${userLocale.country}, IP: ${userLocale.ip}`
          );
        } catch (error) {
          console.error('Error fetching user locale:', error);
        }
      }
    };
    verifySession();
  }, [user, checkSession, onOpen, toast]);

  // Handle form submission for email/password login
  const onSubmit = async (data) => {
    try {
      const loggedInUser = await login(data.email, data.password);
      const userName = loggedInUser?.name || 'User';

      // Store session if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('rememberMe', JSON.stringify(true));
      }

      triggerLoginSuccess(toast, onOpen, userName);
      setIsSessionActive(true);
      reset();
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      triggerLoginFailure(toast, null);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await account.createOAuth2Session(
        'google',
        `${window.location.origin}/success`,
        `${window.location.origin}/failed`
      );
    } catch (error) {
      toast({
        title: 'Google Login Failed',
        description: 'Unable to log in with Google. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width="100%" maxW="md" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="on" method="post">
        <VStack spacing={4}>
          {/* Email Input */}
          <FormControl isInvalid={!!errors.email} isDisabled={isSessionActive}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="username"
              {...register('email')}
              isDisabled={isSessionActive}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          {/* Password Input */}
          <FormControl
            isInvalid={!!errors.password}
            isDisabled={isSessionActive}
          >
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register('password')}
              isDisabled={isSessionActive}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          {/* Remember Me Checkbox */}
          <Checkbox {...register('rememberMe')}>Remember Me</Checkbox>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
            isDisabled={isSessionActive}
          >
            Log In
          </Button>

          {/* Google Login Button */}
          <Button
            mt={4}
            colorScheme="teal"
            variant="outline"
            onClick={handleGoogleLogin}
            isLoading={loading}
            width="full"
            isDisabled={isSessionActive}
          >
            Sign in with Google
          </Button>
        </VStack>
      </form>

      {/* Session Active Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Active Session Detected</ModalHeader>
          <ModalBody>{`You are currently logged in as ${user?.name}. Please log out first before you continue.`}</ModalBody>
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
