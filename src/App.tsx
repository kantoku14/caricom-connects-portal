import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Register } from './pages/Register';
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';
import { Home } from './pages/Home';
import { LoginWelcome } from './components/LoginWelcome';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavBar } from './components/NavBar';
import { Dashboard } from './pages/Dashboard';
import { CheckEmail } from './pages/CheckEmail';
import { Verify } from './pages/Verify'; // Import the Verify page component

export const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Box p={4}>
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
              <Route path="/check-email" element={<CheckEmail />} />
              <Route
                path="/verify"
                element={<Verify />} // Route to the Verify page
              />
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
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

// Public Route Helper to restrict authenticated users from accessing login/register
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Private Route Helper to protect authenticated routes like /dashboard
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
