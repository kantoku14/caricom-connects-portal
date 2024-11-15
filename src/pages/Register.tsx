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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  const { register: signUp } = useAuth(); // Use the updated register function
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Handle user registration and email verification
  const onSubmit = async (data) => {
    try {
      // Register the user without expecting an immediate session
      await signUp(data.fullName, data.email, data.password, data.role);
      reset();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
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

          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Tooltip label="Password must be 8+ characters, with uppercase, lowercase, number, and special character.">
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                autoComplete="new-password"
              />
            </Tooltip>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

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

          <FormControl isInvalid={errors.terms}>
            <Checkbox {...register('terms')}>
              I agree to the Terms and Conditions
            </Checkbox>
            <FormErrorMessage>
              {errors.terms && errors.terms.message}
            </FormErrorMessage>
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
