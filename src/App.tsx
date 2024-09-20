import React from 'react'
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react'

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Box textAlign="center" fontSize="xl" p={5}>
        <Heading>Welcome to CARICOM Connects</Heading>
        <Text mt={4}>
          Your centralized hub for cross-regional collaboration
        </Text>
        <button onClick={() => methodDoesNotExist()}>Break the world</button>
      </Box>
    </ChakraProvider>
  )
}

export default App
