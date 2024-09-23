import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  FormErrorMessage,
  RadioGroup,
  Radio,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register: signUp } = useAuth(); // Access the registration method from AuthContext
  const toast = useToast();

  // `react-hook-form` for form state and validation
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { fullName, email, password, role } = data;
      await signUp(fullName, email, password, role); // Include fullName and role in the signUp call
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
          <FormControl isInvalid={errors.fullName}>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register('fullName', {
                required: 'Full name is required',
              })}
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
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl as="fieldset" isInvalid={errors.role}>
            <FormLabel as="legend">Select Role</FormLabel>
            <RadioGroup defaultValue="Buyer">
              <HStack spacing="24px">
                <Radio
                  value="Buyer"
                  {...register('role', { required: 'Please select a role' })}
                >
                  Buyer
                </Radio>
                <Radio
                  value="Seller"
                  {...register('role', { required: 'Please select a role' })}
                >
                  Seller
                </Radio>
              </HStack>
            </RadioGroup>
            <FormErrorMessage>
              {errors.role && errors.role.message}
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
