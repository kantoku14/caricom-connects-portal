import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register'; // Correct import path for Register
import { Success } from './pages/Success'; // Success route
import { Failure } from './pages/Failure'; // Failure route
import { Home } from './pages/Home'; // Your Home page
import { Login } from './pages/Login'; // Login page
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext'; // Importing AuthProvider for user authentication

export const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Box p={4}>
            <Routes>
              {/* Home Route */}
              <Route path="/" element={<Home />} />

              {/* TEST CODE Route */}
              <Route path="/test-code" element={<ExampleComponent />} />

              {/* Model TEST Route */}
              <Route path="/model-test" element={<ModelTest />} />

              {/* Register Route */}
              <Route path="/register" element={<Register />} />

              {/* Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Success and Failure Routes */}
              <Route path="/success" element={<Success />} />
              <Route path="/failed" element={<Failure />} />
            </Routes>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};
