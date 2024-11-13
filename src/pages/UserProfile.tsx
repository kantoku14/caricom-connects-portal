// UserProfile.tsx

import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(2, { message: 'City is required' }),
});

export const UserProfile = () => {
  const { user, updateUserPreferences } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: user?.prefs.phone || '',
      address: user?.prefs.address || '',
      city: user?.prefs.city || '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateUserPreferences(data);
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      reset(data);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description:
          'There was an error updating your profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.phone}>
            <FormLabel htmlFor="phone">Phone Number</FormLabel>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              {...register('phone')}
            />
            <FormErrorMessage>
              {errors.phone && errors.phone.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.address}>
            <FormLabel htmlFor="address">Address</FormLabel>
            <Input
              id="address"
              placeholder="Enter your address"
              {...register('address')}
            />
            <FormErrorMessage>
              {errors.address && errors.address.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.city}>
            <FormLabel htmlFor="city">City</FormLabel>
            <Input
              id="city"
              placeholder="Enter your city"
              {...register('city')}
            />
            <FormErrorMessage>
              {errors.city && errors.city.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
          >
            Update Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
