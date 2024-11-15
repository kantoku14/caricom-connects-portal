import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  useBreakpointValue,
  Stack,
  Avatar,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { user, updateUserAvatar } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'PPpp'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: 'File Selected',
        description: `Selected file: ${e.target.files[0].name}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAvatarUpdate = async () => {
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file before uploading.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      toast({
        title: 'Uploading',
        description: 'Your avatar is being uploaded...',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });

      await updateUserAvatar(file);

      toast({
        title: 'Success',
        description: 'Your avatar has been updated!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFile(null); // Clear the selected file after successful upload
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'An error occurred while uploading your avatar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Welcome to Your Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {/* User Profile Card */}
        <Box
          p={6}
          border="1px solid"
          borderRadius="md"
          minHeight="200px"
          onClick={() => isMobile && navigate('/profile')}
          _hover={{ cursor: isMobile ? 'pointer' : 'auto' }}
        >
          <Heading size="md" mb={4}>
            Your Profile
          </Heading>
          <Stack direction="row" alignItems="center" mb={4}>
            <Avatar
              src={user?.prefs.avatar || 'https://via.placeholder.com/150'}
              size="lg"
            />
            <Box>
              <Text fontWeight="bold">{user?.name}</Text>
              <Text>{user?.prefs.role}</Text>
            </Box>
          </Stack>
          <Text>Email: {user?.email}</Text>
          <Input
            type="file"
            mt={4}
            onChange={handleFileChange}
            accept="image/*"
            display="none"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload">
            <Button mt={4} colorScheme="yellow" as="span">
              Choose Avatar
            </Button>
          </label>
          <Button
            mt={4}
            ml={4}
            colorScheme="blue"
            onClick={handleAvatarUpdate}
            disabled={!file}
          >
            Upload Avatar
          </Button>
        </Box>

        {/* Additional cards remain unchanged */}
      </SimpleGrid>
    </Box>
  );
};
