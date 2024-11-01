import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormErrorMessage,
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
import { GoogleIcon } from '../components/ProviderIcons'; // Use Google icon for the button
import { LogoIcon } from '../components/Logo'; // Logo component for header

// Validation schema using Zod for login
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8+ characters' }),
});

export const Login = () => {
  const { login, user, checkSession } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Check for an active session on component load or after login
  useEffect(() => {
    const verifySession = async () => {
      const sessionUser = user || (await checkSession());
      if (sessionUser) {
        setIsSessionActive(true);
        triggerSessionActive(toast, onOpen, sessionUser.name);

        // Fetch user locale information
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
      triggerLoginSuccess(toast, onOpen, userName);
      setIsSessionActive(true);
      reset();
    } catch (error) {
      triggerLoginFailure(toast, null);
    }
  };

  // Handle Google login
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
    <Stack spacing="8" maxWidth="md" mx="auto" py="12" px="6">
      <Stack align="center">
        <LogoIcon />
        <Heading size="md" textAlign="center">
          Join the CARICOM Connects Network
        </Heading>
        <Text fontSize="md" color="gray.600" textAlign="center">
          This portal is the place to unite, trade, and share knowledge across
          the Caribbean.
        </Text>
      </Stack>

      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing="6"
        autoComplete="on"
      >
        <Stack spacing="5" width="full">
          <FormControl isInvalid={!!errors.email} isDisabled={isSessionActive}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="username"
              {...register('email')}
              isDisabled={isSessionActive}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
              autoComplete="current-password"
              {...register('password')}
              isDisabled={isSessionActive}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <HStack justify="space-between" width="full">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Link color="teal.500" fontSize="sm">
            Forgot password?
          </Link>
        </HStack>

        <Stack spacing="4" width="full">
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            isDisabled={isSessionActive}
            width="full"
          >
            Log In
          </Button>
          <Button
            variant="outline"
            leftIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            isLoading={loading}
            isDisabled={isSessionActive}
            width="full"
          >
            Sign in with Google
          </Button>
        </Stack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Active Session Detected</ModalHeader>
          <ModalBody>
            {`You are currently logged in as ${user?.name}. Please log out first before you continue.`}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};
