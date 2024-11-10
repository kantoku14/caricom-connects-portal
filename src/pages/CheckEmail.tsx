import { Box, Heading, Text, VStack, Button, Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { account } from '../appwriteConfig';

export const CheckEmail = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const resendVerificationEmail = async () => {
    try {
      await account.createVerification(`${window.location.origin}/verify`);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email for the verification link.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error Resending Verification',
        description:
          'There was an issue resending the verification email. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center minHeight="100vh" bg="gray.50">
      <Box
        maxW="lg"
        mx="auto"
        py={10}
        px={6}
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
        textAlign="center"
      >
        <VStack spacing={5}>
          <Heading size="lg">Almost There!</Heading>
          <Text>
            A verification email has been sent to your inbox. Please check your
            email and follow the instructions to verify your account.
          </Text>
          <Button
            colorScheme="teal"
            variant="solid"
            onClick={resendVerificationEmail}
          >
            Resend Verification Email
          </Button>
          <Button
            variant="link"
            colorScheme="teal"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};
