import { Box, Button, Flex, Link, Spacer } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Hide the navbar on the home ("/") and check email pages
  if (location.pathname === '/' || location.pathname === '/check-email') {
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
          {/* Show Dashboard link if not on the Dashboard page */}
          {location.pathname !== '/dashboard' && (
            <NavLink to="/dashboard" style={{ marginRight: '15px' }}>
              Dashboard
            </NavLink>
          )}

          {/* Show Profile link if not on the Profile page */}
          {location.pathname !== '/profile' && (
            <NavLink to="/profile" style={{ marginRight: '15px' }}>
              Profile
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
