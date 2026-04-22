import { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Button,
  Stack,
  Divider,
  CardFooter,
  ButtonGroup,
  useToast,
  Flex,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState("All"); 

  const dispatch = useDispatch();
  const toast = useToast();

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get("https://meal-kit-ecommerce.onrender.com/api/products"),
        axios.get("https://meal-kit-ecommerce.onrender.com/api/categories")
      ]);
      
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast({
      title: "Delicious choice!",
      description: `${product.name} added to your cart.`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top", 
    });
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => {
        const prodCatId = typeof product.categoryId === 'object' ? product.categoryId._id : product.categoryId;
        return prodCatId === selectedCategory;
      });

  return (
    <Box p={8} bg="orange.50" minH="100vh"> 
      <Heading mb={6} textAlign="center" color="gray.800" size="2xl">
        Our Delicious Meals
      </Heading>

      <Flex justify="center" mb={10} maxW="7xl" mx="auto">
        <Wrap spacing={4} justify="center">
          <WrapItem>
            <Button
              colorScheme={selectedCategory === "All" ? "orange" : "gray"}
              variant={selectedCategory === "All" ? "solid" : "outline"}
              onClick={() => setSelectedCategory("All")}
              borderRadius="full"
              px={8}
            >
              All Menu
            </Button>
          </WrapItem>
          
          {categories.map((cat) => (
            <WrapItem key={cat._id}>
              <Button
                colorScheme={selectedCategory === cat._id ? "orange" : "gray"}
                variant={selectedCategory === cat._id ? "solid" : "outline"}
                onClick={() => setSelectedCategory(cat._id)}
                borderRadius="full"
                px={8}
              >
                {cat.title}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Flex>

      {filteredProducts.length === 0 ? (
        <Text textAlign="center" fontSize="xl" color="gray.500" mt={10}>
          No meals found in this category yet. Chef is cooking! 👨‍🍳
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="7xl" mx="auto">
          {filteredProducts.map((product) => ( 
            <Card 
              key={product._id} 
              maxW='sm' 
              bg="white" 
              boxShadow="md" 
              _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }} 
              transition="all 0.3s"
              borderRadius="2xl" 
              overflow="hidden"
            >
              <CardBody p={0}> 
                <Image
                  src={product.imageUrl || "https://placehold.co/400x300/orange/white?text=Yummy+Meal"} 
                  alt={product.name}
                  height="250px"
                  objectFit="cover"
                  w="full"
                />
                <Stack mt='4' spacing='3' p={5}>
                  <Heading size='md' color="gray.700">{product.name}</Heading>
                  <Text noOfLines={2} color="gray.500">
                    {product.description}
                  </Text>
                  <Text color='orange.500' fontSize='2xl' fontWeight="900">
                    ${product.price?.toFixed(2)} JD
                  </Text>
                </Stack>
              </CardBody>
              
              <Divider borderColor="gray.100" />
              
              <CardFooter pt={4} pb={5} px={5}>
                <ButtonGroup spacing='2' w="full">
                  <Button 
                    variant='solid' 
                    colorScheme='orange' 
                    w="full"
                    size="lg"
                    borderRadius="xl"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart 🛒
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Home;