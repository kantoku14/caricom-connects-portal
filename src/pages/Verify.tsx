import {
  Button,
  Box,
  VStack,
  Text,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { account } from '../appwriteConfig'; // Appwrite configuration
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  triggerVerificationSuccess,
  triggerVerificationFailure,
} from '../utils/message'; // Message functions for toasts

export const Verify = () => {
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyUserEmail = async () => {
      const userId = searchParams.get('userId');
      const secret = searchParams.get('secret');

      if (!userId || !secret) {
        triggerVerificationFailure(toast, 'Invalid verification link');
        navigate('/login'); // Redirect to login if invalid link
        return;
      }

      try {
        await account.updateVerification(userId, secret); // Verify user email
        setIsVerified(true);
        triggerVerificationSuccess(toast); // Notify success
      } catch (error) {
        console.error('Verification failed:', error);
        triggerVerificationFailure(toast, 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail(); // Run verification on component mount
  }, [toast, navigate, searchParams]);

  const handleNavigateLogin = () => {
    navigate('/login'); // Redirect to login
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto" textAlign="center">
      {loading ? (
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text>Verifying your email...</Text>
        </VStack>
      ) : isVerified ? (
        <Modal isOpen={!loading}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Email Verified Successfully</ModalHeader>
            <ModalBody>
              <Text>
                Your email has been verified successfully! You can now log in
                with your account.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={handleNavigateLogin}>
                Go to Login
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <VStack spacing={4}>
          <Text color="red.500">
            Email verification failed. Please check your verification link or
            contact support.
          </Text>
          <Button colorScheme="teal" onClick={handleNavigateLogin}>
            Go to Login
          </Button>
        </VStack>
      )}
    </Box>
  );
};
