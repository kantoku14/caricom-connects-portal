import { useForm } from 'react-hook-form';
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
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register: signUp } = useAuth(); // Assuming AuthContext provides register method
  const toast = useToast();

  const [suggestedPassword, setSuggestedPassword] = useState('');

  // `react-hook-form` for form state and validation
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = useForm();

  // Function to generate a strong password that meets validation criteria
  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+~';
    const allChars = uppercase + lowercase + numbers + specialChars;
    const length = 12;

    let password = '';

    // Ensure each password has at least one uppercase, lowercase, number, and special character
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest of the password with random characters from allChars
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to avoid predictable patterns
    password = password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');

    setSuggestedPassword(password);
    setValue('password', password, { shouldValidate: true }); // Automatically fill the password field and trigger validation
    trigger('password'); // Manually trigger validation for password
  };

  const onSubmit = async (data) => {
    try {
      // Call the registration method from AuthContext
      await signUp(data.email, data.password);
      toast({
        title: 'Account created.',
        description: 'Your account was successfully created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error creating account.',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxWidth="400px" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email" // Autocomplete for email input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Tooltip label="Password must be 8+ characters, contain upper/lowercase letters, and a special character.">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password" // Autocomplete for new password
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Minimum length is 8 characters',
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Password must contain an uppercase letter, lowercase letter, a number, and a special character',
                  },
                })}
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
              colorScheme="blue"
            >
              Suggest Strong Password
            </Button>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.terms}>
            <Checkbox
              {...register('terms', {
                required: 'You must accept the terms and conditions',
              })}
            >
              I agree to the Terms and Conditions
            </Checkbox>
            <FormErrorMessage>
              {errors.terms && errors.terms.message}
            </FormErrorMessage>{' '}
            {/* Show error for terms */}
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
