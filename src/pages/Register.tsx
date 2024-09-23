import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
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
  terms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  role: z.enum(['Buyer', 'Seller'], { message: 'Please select a role' }),
});

export const Register = () => {
  const { register: signUp } = useAuth(); // Assuming AuthContext provides register method
  const toast = useToast();
  const [suggestedPassword, setSuggestedPassword] = useState('');

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
    reset, // <-- added reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Automatically generate browser-suggested password
  useEffect(() => {
    // Using the browser's built-in password suggestion
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.setAttribute('autocomplete', 'new-password');
    }
  }, []);

  // Strong password generator function
  const generatePassword = () => {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    setSuggestedPassword(password);
    setValue('password', password, { shouldValidate: true }); // Automatically fill the password field and trigger validation
    trigger('password'); // Manually trigger validation for password
  };

  // On form submit
  const onSubmit = async (data) => {
    try {
      // Call the AuthContext register method
      await signUp(data.fullName, data.email, data.password, data.role);
      toast({
        title: 'Account created.',
        description: 'Your account was successfully created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        colorScheme: 'teal',
      });

      reset(); // <-- Reset the form after a successful submission
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

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          {/* Full Name Input */}
          <FormControl isInvalid={errors.fullName}>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register('fullName')}
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
                autoComplete="new-password" // Browser password suggestion
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
                <Radio value="Buyer" {...register('role')}>
                  Buyer
                </Radio>
                <Radio value="Seller" {...register('role')}>
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
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
