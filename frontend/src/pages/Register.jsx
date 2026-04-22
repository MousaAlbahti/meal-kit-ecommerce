import { useState } from 'react';
import { Box, Heading, Button, VStack, FormControl, FormLabel, Input, useToast, Flex, Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { saveUserLogin } from '../redux/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        email,
        password,
        phoneNumber,
        address: { city, street, building } 
      };

      const response = await axios.post('https://meal-kit-ecommerce.onrender.com/api/auth/register', userData);

      dispatch(saveUserLogin({
        user: response.data.user, 
        token: response.data.token 
      }));
      
      toast({
        title: 'Account created.',
        description: "Welcome to Meal-Kit!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/'); 
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex 
      minH="100vh" 
      bg="orange.100"
      align="center" 
      justify="center" 
      py={10} 
      px={4}
    >
      <Box 
        w="full"
        maxW="xl" 
        bg="white" 
        p={8} 
        borderWidth="1px" 
        borderColor="red.200"
        borderRadius="xl" 
        boxShadow="2xl"
      >
        <Heading mb={6} textAlign="center" color="gray.800">Create an Account</Heading>
        
        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <Flex w="full" gap={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Full Name</FormLabel>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} focusBorderColor="orange.400" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Phone Number</FormLabel>
                <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} focusBorderColor="orange.400" />
              </FormControl>
            </Flex>

            <FormControl isRequired>
              <FormLabel fontWeight="semibold">Email Address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} focusBorderColor="orange.400" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="semibold">Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} focusBorderColor="orange.400" />
            </FormControl>

            <Text w="full" textAlign="left" fontWeight="bold" mt={4} color="gray.600">Default Shipping Address:</Text>
            
            <Flex w="full" gap={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">City</FormLabel>
                <Input type="text" value={city} onChange={(e) => setCity(e.target.value)} focusBorderColor="orange.400" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Street</FormLabel>
                <Input type="text" value={street} onChange={(e) => setStreet(e.target.value)} focusBorderColor="orange.400" />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel fontWeight="semibold">Building / Apartment (Optional)</FormLabel>
              <Input type="text" value={building} onChange={(e) => setBuilding(e.target.value)} focusBorderColor="orange.400" />
            </FormControl>

            <Button type="submit" colorScheme="red" size="lg" w="full" mt={6} boxShadow="md">
              Register
            </Button>

            <Text mt={4} textAlign="center">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2023dd', fontWeight: 'bold' }}>
                Login here
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;