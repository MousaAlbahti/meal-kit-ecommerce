import { Box, Flex, Button, Text, Spacer } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { clearCart } from '../redux/cartSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login'); 
    dispatch(clearCart());
  };

  const cartItemsCount = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;

  return (
    <Flex 
      bg="red.500" 
      p={4} 
      color="white" 
      alignItems="center"
      boxShadow="sm"
    >
      
      <Box>
        <Link to="/">
          <Text fontSize="2xl" fontWeight="900" letterSpacing="widest">
            MEAL-KIT
          </Text>
        </Link>
      </Box>

      <Spacer />

      <Flex alignItems="center" gap={6}>
        
        <Link to="/cart">
          <Flex alignItems="center" _hover={{ opacity: 0.8 }} transition="0.2s">
            <Text fontSize="lg" fontWeight="bold">
              🛒 Cart
            </Text>
            
            {cartItemsCount > 0 && (
              <Box
                bg="white"
                color="orange.600"
                borderRadius="full"
                px={2}
                py={0.5}
                ml={2}
                fontSize="xs"
                fontWeight="bold"
              >
                {cartItemsCount}
              </Box>
            )}
          </Flex>
        </Link>

        <Box>
          {user ? (
            <Flex alignItems="center" gap={4}>
              {user.role === 'admin' && (
    <Link to="/admin">
      <Button colorScheme="orange" size="sm" variant="solid">
        Dashboard
      </Button>
    </Link>
  )}
              <Text fontWeight="medium">Welcome, {user.name}</Text>
              
              <Button colorScheme="blackAlpha" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Flex>
          ) : (
            <Link to="/login">
              <Button variant="outline" colorScheme="whiteAlpha" size="sm">
                Login
              </Button>
            </Link>
          )}
        </Box>

      </Flex>
      
    </Flex>
    
  );
};

export default Navbar;