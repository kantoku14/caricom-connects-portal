import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './pages/Home';
import { LoginWelcome } from './components/LoginWelcome';
import { Register } from './pages/Register';
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';
import { Dashboard } from './pages/Dashboard';
import { NavBar } from './components/NavBar';

export const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginWelcome />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route path="/success" element={<Success />} />
              <Route path="/failed" element={<Failure />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

// Public Route Helper
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Private Route Helper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
