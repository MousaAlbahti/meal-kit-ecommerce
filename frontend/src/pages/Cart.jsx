import { Box, Heading, Text, Flex, Button, Divider, HStack } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, addToCart, decreaseCart } from '../redux/cartSlice';

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <Flex 
      minH="100vh" 
      bg="orange.50" 
      align="flex-start"
      justify="center" 
      py={10} 
      px={4}
    >
      <Box w="full" maxW="4xl" bg="white" p={8} borderRadius="xl" boxShadow="2xl">
        <Heading mb={8} textAlign="center" color="gray.800">Shopping Cart</Heading>

        {cartItems.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="xl" mb={6} color="gray.600">Your cart is empty!</Text>
            <Link to="/">
              <Button colorScheme="orange" size="lg" w="full" maxW="sm">Go Back to Menu</Button>
            </Link>
          </Box>
        ) : (
          <Box>
            {cartItems.map((item) => (
              <Flex 
                key={item._id} 
                align={{ base: "flex-start", md: "center" }} 
                direction={{ base: "column", md: "row" }}
                justify="space-between" 
                mb={4} 
                p={4} 
                borderWidth="1px" 
                borderColor="orange.100" 
                borderRadius="lg"
                _hover={{ bg: "orange.50" }} 
                transition="all 0.2s"
                gap={4}
              >
                
                <Box flex="1">
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">{item.name}</Text>
                  <Text color="gray.500">
                    {item.price?.toFixed(2)} JD / each
                  </Text>
                </Box>

                <HStack maxW="150px">
                  <Button 
                    size="sm" 
                    colorScheme="orange" 
                    variant="outline" 
                    onClick={() => dispatch(decreaseCart(item))}
                  >
                    -
                  </Button>
                  <Text fontWeight="bold" w="30px" textAlign="center">{item.qty}</Text>
                  <Button 
                    size="sm" 
                    colorScheme="orange" 
                    variant="solid" 
                    onClick={() => dispatch(addToCart(item))}
                  >
                    +
                  </Button>
                </HStack>

                <Flex align="center" gap={4} minW="180px" justify="flex-end">
                  <Text fontWeight="bold" color="orange.500" fontSize="lg">
                    {(item.price * item.qty).toFixed(2)} JD
                  </Text>
                  
                  <Button colorScheme="red" variant="ghost" size="sm" onClick={() => dispatch(removeFromCart(item._id))}>
                    Remove
                  </Button>
                </Flex>

              </Flex>
            ))}

            <Divider my={6} borderColor="gray.200" />

            <Flex justify="space-between" align="center" p={6} bg="gray.50" borderRadius="xl" borderWidth="1px" direction={{ base: "column", sm: "row" }} gap={4}>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                Total: <Text as="span" color="orange.500">{totalPrice.toFixed(2)} JD</Text>
              </Text>
              
              <Link to="/checkout">
                <Button colorScheme="orange" size="lg" boxShadow="md" _hover={{ transform: 'translateY(-2px)' }}>
                  Proceed to Checkout
                </Button>
              </Link>
            </Flex>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default Cart;