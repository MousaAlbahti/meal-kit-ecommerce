import { useState } from 'react';
import { Box, Heading, Button, VStack, FormControl, FormLabel, Input, useToast, Text, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { saveUserLogin } from '../redux/authSlice'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email, 
        password
      });

      dispatch(saveUserLogin({
        user: response.data, 
        token: response.data.token 
      }));
      
      toast({
        title: 'Login Successful',
        description: "Welcome back",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/');
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: err.response?.data?.message || 'Invalid email or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Flex 
      minH="100vh" 
      bg="orange.100" 
      align="center" 
      justify="center" 
      px={4}
    >
      <Box 
        w="full" 
        maxW="md" 
        bg="white" 
        p={8} 
        borderWidth="1px" 
        borderColor="red.200" 
        borderRadius="xl" 
        boxShadow="2xl" 
      >
        <Heading mb={6} textAlign="center" color="gray.800">Login</Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">Email Address</FormLabel>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                focusBorderColor="red.400" 
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="semibold">Password</FormLabel>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                focusBorderColor="red.400"
              />
            </FormControl>

            <Button type="submit" colorScheme="red" size="lg" w="full" mt={6} boxShadow="md">
              Login
            </Button>

            <Text mt={4} textAlign="center">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2023dd', fontWeight: 'bold' }}>
                Register here
              </Link>
            </Text>

          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;