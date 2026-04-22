import { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, VStack, Divider, useToast, FormControl, FormLabel, Input, Select, Flex } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);
  
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setCity(user?.address?.city || '');
      setStreet(user?.address?.street || '');
      setBuilding(user?.address?.building || '');
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  console.log("🕵️‍♂️ USER DATA FROM REDUX:", user);

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault(); 
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const formattedItems = cartItems.map((item) => ({
        productId: item._id,
        quantity: item.qty
      }));

      const orderData = {
        orderNumber: `ORD-${Date.now()}`, 
        user: user._id, 
        items: formattedItems, 
        totalPrice: totalPrice,
        shippingAddress: { 
          city: city, 
          street: street, 
          building: building 
        },
        paymentMethod: paymentMethod 
      };

      await axios.post('https://meal-kit-ecommerce.onrender.com/api/orders', orderData, config);

      dispatch(clearCart());
      
      toast({
        title: 'Order Placed Successfully!',
        description: 'Your delicious meal kit is on the way.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: 'Failed to place order',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" bg="orange.50" align="flex-start" justify="center" py={10} px={4}>
      <Box w="full" maxW="4xl" bg="white" p={8} borderWidth="1px" borderColor="orange.100" borderRadius="xl" boxShadow="2xl">
        <Heading mb={8} textAlign="center" color="gray.800">Checkout Process</Heading>
        
        <form onSubmit={handlePlaceOrder}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
            
            <VStack flex="1" align="stretch" spacing={5}>
              <Text fontSize="xl" fontWeight="bold" color="gray.700" borderBottomWidth="2px" borderColor="orange.200" pb={2}>
                Shipping Address
              </Text>
              
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">City</FormLabel>
                <Input value={city} onChange={(e) => setCity(e.target.value)} focusBorderColor="orange.400" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Street</FormLabel>
                <Input value={street} onChange={(e) => setStreet(e.target.value)} focusBorderColor="orange.400" />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Building / Apartment</FormLabel>
                <Input value={building} onChange={(e) => setBuilding(e.target.value)} focusBorderColor="orange.400" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Payment Method</FormLabel>
                <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} focusBorderColor="orange.400">
                  <option value="Cash">Cash on Delivery</option>
                  <option value="Card">Credit Card</option>
                </Select>
              </FormControl>
            </VStack>

            <VStack flex="1" align="stretch" spacing={5} bg="gray.50" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Text fontSize="xl" fontWeight="bold" color="gray.700" borderBottomWidth="2px" borderColor="orange.200" pb={2}>
                Order Summary
              </Text>
              
              <Box>
                <Text fontSize="sm" color="gray.500">Customer:</Text>
                <Text fontWeight="bold" fontSize="lg" color="gray.800">{user.name}</Text>
                <Text fontSize="sm" color="gray.600">{user.email}</Text>
              </Box>
              
              <Divider borderColor="gray.300" />

              <Box maxH="200px" overflowY="auto" pr={2}>
                {cartItems.map((item) => (
                  <Flex justify="space-between" key={item._id} fontSize="sm" mb={2}>
                    <Text color="gray.700">{item.qty}x {item.name}</Text>
                    <Text fontWeight="bold" color="gray.700">${(item.price * item.qty).toFixed(2)}</Text>
                  </Flex>
                ))}
              </Box>

              <Divider borderColor="gray.300" />

              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold" color="gray.700">Total:</Text>
                <Text fontSize="2xl" fontWeight="900" color="orange.500">
                  ${totalPrice.toFixed(2)}
                </Text>
              </Flex>

              <Button 
                type="submit" 
                colorScheme="orange" 
                size="lg" 
                w="full" 
                mt={2} 
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: "lg" }}
                isDisabled={cartItems.length === 0}
              >
                Place Order
              </Button>
            </VStack>

          </Flex>
        </form>
      </Box>
    </Flex>
  );
};

export default Checkout;    