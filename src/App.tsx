import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register'; // Correct import path
import { Success } from './pages/Success'; // Success route
import { Failure } from './pages/Failure'; // Failure route
import { Home } from './pages/Home'; // Your Home page
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';

// Log the project ID to verify it's correctly loaded
console.log('Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Box p={4}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failed" element={<Failure />} />
            </Routes>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};
