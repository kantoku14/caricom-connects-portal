import { Box, Button, Flex, Link, Spacer, Text } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation(); // Get the current route

  // Hide the nav bar on the home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Flex as="nav" bg="teal.500" p={4} color="white" align="center">
      <Link as={NavLink} to="/" fontWeight="bold" fontSize="lg" color="white">
        CARICOM CONNECTS
      </Link>
      <Spacer />

      {isAuthenticated ? (
        <>
          {/* Show Home link unless the user is on the Home page */}
          {location.pathname !== '/' && (
            <NavLink to="/" style={{ marginRight: '15px' }}>
              Home
            </NavLink>
          )}

          {/* Show Dashboard link unless the user is on the Dashboard */}
          {location.pathname !== '/dashboard' && (
            <NavLink to="/dashboard" style={{ marginRight: '15px' }}>
              Dashboard
            </NavLink>
          )}

          <Button
            onClick={logout}
            variant="outline"
            color="white"
            _hover={{ bg: 'teal.600' }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          {/* For non-authenticated users, show links to Login and Register */}
          {location.pathname !== '/login' && (
            <NavLink to="/login" style={{ marginRight: '15px' }}>
              Login
            </NavLink>
          )}
          {location.pathname !== '/register' && (
            <NavLink to="/register" style={{ marginRight: '15px' }}>
              Sign Up
            </NavLink>
          )}
        </>
      )}
    </Flex>
  );
};
