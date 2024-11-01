//Migrate local development environment to EC2 instance
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  FormErrorMessage,
  Checkbox,
  useToast,
  Tooltip,
  RadioGroup,
  Stack,
  Radio,
  Text,
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
import { account } from '../appwriteConfig'; // Import Appwrite config
import { useAuth } from '../context/AuthContext';

// Validation schema using Zod
const schema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be 8+ characters' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).*$/, {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  role: z.enum(['Buyer', 'Seller'], { message: 'Please select a role' }),
});

export const Register = () => {
  const { register: signUp } = useAuth();
  const toast = useToast();
  const [suggestedPassword, setSuggestedPassword] = useState('');
  const [loading, setLoading] = useState(false); // OAuth loading state
  const [isSessionActive, setIsSessionActive] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Check if a session is active immediately after registration and when the component mounts
  const checkSession = async () => {
    try {
      const currentSession = await account.get(); // Check if the user is logged in
      if (currentSession) {
        setIsSessionActive(true);
        onOpen(); // Open the modal to inform the user
      }
    } catch (error) {
      console.error('No Active User Session:', error); // Log the error for debugging
      setIsSessionActive(false);
    }
  };

  useEffect(() => {
    checkSession(); // Check session on component mount
  }, []);

  const generatePassword = () => {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    setSuggestedPassword(password);
    setValue('password', password, { shouldValidate: true });
    trigger('password');
  };

  const onSubmit = async (data) => {
    if (isSessionActive) {
      toast({
        title: 'Active session',
        description: 'Please log out before registering a new account.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        colorScheme: 'teal',
      });
      return;
    }
    try {
      await signUp(data.fullName, data.email, data.password, data.role);
      toast({
        title: 'Account created.',
        description: 'Your account was successfully created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        colorScheme: 'teal',
      });
      reset();

      // Immediately check session after successful registration
      await checkSession();
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error creating account.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        colorScheme: 'teal',
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await account.createOAuth2Session(
        'google', // OAuth provider
        'http://localhost:5175/success', // Success URL
        'http://localhost:5175/failed', // Failure URL
        ['email', 'profile'] // Scopes
      );
      await checkSession(); // Check session after Google login
    } catch (error) {
      console.error('OAuth Login Error:', error);
      toast({
        title: 'Login Failed',
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
    <Box p={8} maxWidth="500px" mx="auto">
      {/* Modal to inform the user about the active session */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Active Session Detected</ModalHeader>
          <ModalBody>
            You are already logged in. Please log out first to register a new
            account.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Registration form */}
      <form onSubmit={handleSubmit(onSubmit)} disabled={isSessionActive}>
        <VStack spacing={4}>
          {/* Full Name Input */}
          <FormControl isInvalid={errors.fullName}>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register('fullName')}
              isDisabled={isSessionActive} // Disable if session is active
            />
            <FormErrorMessage>
              {errors.fullName && errors.fullName.message}
            </FormErrorMessage>
          </FormControl>

          {/* Email Input */}
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              autoComplete="email"
              isDisabled={isSessionActive} // Disable if session is active
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          {/* Password Input */}
          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Tooltip label="Password must be 8+ characters, with uppercase, lowercase, number, and special character.">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                autoComplete="new-password"
                isDisabled={isSessionActive} // Disable if session is active
              />
            </Tooltip>
            {suggestedPassword && (
              <Text color="green.500">
                Suggested Password: {suggestedPassword}
              </Text>
            )}
            <Button
              mt={2}
              size="sm"
              onClick={generatePassword}
              colorScheme="teal"
              isDisabled={isSessionActive} // Disable if session is active
            >
              Suggest Strong Password
            </Button>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          {/* Role Selection */}
          <FormControl isInvalid={errors.role}>
            <FormLabel htmlFor="role">Role</FormLabel>
            <RadioGroup>
              <Stack direction="row">
                <Radio
                  value="Buyer"
                  {...register('role')}
                  isDisabled={isSessionActive}
                >
                  Buyer
                </Radio>
                <Radio
                  value="Seller"
                  {...register('role')}
                  isDisabled={isSessionActive}
                >
                  Seller
                </Radio>
              </Stack>
            </RadioGroup>
            <FormErrorMessage>
              {errors.role && errors.role.message}
            </FormErrorMessage>
          </FormControl>

          {/* Terms and Conditions */}
          <FormControl isInvalid={errors.terms}>
            <Checkbox
              {...register('terms', {
                required: 'You must accept the terms and conditions',
              })}
              isDisabled={isSessionActive} // Disable if session is active
            >
              I agree to the Terms and Conditions
            </Checkbox>
            <FormErrorMessage>
              {errors.terms && errors.terms.message}
            </FormErrorMessage>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
            isDisabled={isSessionActive} // Disable if session is active
          >
            Sign Up
          </Button>

          {/* Google OAuth Button */}
          <Button
            mt={4}
            colorScheme="teal"
            variant="outline"
            isLoading={loading}
            onClick={handleGoogleLogin}
            width="full"
            isDisabled={isSessionActive} // Disable if session is active
          >
            Sign in with Google
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
