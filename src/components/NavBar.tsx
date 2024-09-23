import { Flex, Link } from '@chakra-ui/react';

export const Navbar = () => {
  return (
    <Flex
      as="nav"
      justify="space-between"
      align="center"
      p={4}
      bg="teal.500"
      color="white"
    >
      <Link href="/" _hover={{ textDecoration: 'none', color: 'teal.200' }}>
        CARICOM Connects
      </Link>
      <Flex align="center">
        <Link
          href="/register"
          _hover={{ textDecoration: 'none', color: 'teal.200' }}
        >
          Register
        </Link>
      </Flex>
    </Flex>
  );
};
