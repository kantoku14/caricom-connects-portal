import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  FormErrorMessage,
  Checkbox,
  Tooltip,
  RadioGroup,
  Stack,
  Radio,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { account } from '../appwriteConfig';
import { useAuth } from '../context/AuthContext';
import {
  triggerFormSubmissionSuccess,
  triggerFormSubmissionError,
} from '../utils/message';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [isSessionActive, setIsSessionActive] = useState(false);

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = await account.get();
        if (currentSession) {
          setIsSessionActive(true);
        }
      } catch (error) {
        setIsSessionActive(false);
      }
    };
    checkSession(); // Check session on component mount
  }, []);

  // Handle user registration and email verification
  const onSubmit = async (data) => {
    if (isSessionActive) {
      toast({
        title: 'Session Active',
        description: `You are already logged in. Please log out to register a new account.`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Register the user
      await signUp(data.fullName, data.email, data.password, data.role);

      // Send email verification
      await account.createVerification(`${window.location.origin}/verify`);

      triggerFormSubmissionSuccess(toast, null);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email to verify your account.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      reset();
      navigate('/check-email'); // Redirect to CheckEmail page
    } catch (error) {
      triggerFormSubmissionError(toast, null);
    }
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      {/* Registration form */}
      <form onSubmit={handleSubmit(onSubmit)} disabled={isSessionActive}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.fullName}>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register('fullName')}
              isDisabled={isSessionActive}
            />
            <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              autoComplete="email"
              isDisabled={isSessionActive}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Tooltip label="Password must be 8+ characters, with uppercase, lowercase, number, and special character.">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                autoComplete="new-password"
                isDisabled={isSessionActive}
              />
            </Tooltip>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.role}>
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
            <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.terms}>
            <Checkbox {...register('terms')} isDisabled={isSessionActive}>
              I agree to the Terms and Conditions
            </Checkbox>
            <FormErrorMessage>{errors.terms?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
            isDisabled={isSessionActive}
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
