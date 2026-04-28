import { useState, useEffect } from 'react';
import { 
  Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, 
  Table, Thead, Tbody, Tr, Th, Td, Badge, Flex, Text, Button, useToast,
  FormControl, FormLabel, Input, Textarea, VStack, Select, Image,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// basic card wrapper
const CustomCard = ({ children, ...rest }) => (
  <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" borderWidth="1px" borderColor="orange.100" {...rest}>
    {children}
  </Box>
);

const AdminDashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const notify = useToast();

  const [allOrders, setAllOrders] = useState([]);
  const [mealCats, setMealCats] = useState([]); 
  const [menuItems, setMenuItems] = useState([]); 
  const [siteUsers, setSiteUsers] = useState([]); 
  
  // form inputs for adding a meal
  const [mealName, setMealName] = useState('');
  const [mealPrice, setMealPrice] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [selectedCatId, setSelectedCatId] = useState(''); 
  const [uploadedImg, setUploadedImg] = useState(null); 
  const [loadingMeal, setLoadingMeal] = useState(false);

  const [catInput, setCatInput] = useState(''); 
  const { isOpen: catModalOpen, onOpen: openCatModal, onClose: closeCatModal } = useDisclosure();
  const [editingCat, setEditingCat] = useState({ id: '', title: '' });
  const [loadingCat, setLoadingCat] = useState(false);
  
  const { isOpen: mealModalOpen, onOpen: openMealModal, onClose: closeMealModal } = useDisclosure();
  const [activeMeal, setActiveMeal] = useState({ id: '', name: '', price: '', description: '', categoryId: '' });
  const [newMealImg, setNewMealImg] = useState(null);

  const reqHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // initial load
  const loadDashboardInfo = async () => {
    if (user && user.role === 'admin') {
      try {
        const [oRes, cRes, pRes, uRes] = await Promise.all([
          axios.get('https://meal-kit-ecommerce.onrender.com/api/orders/all', reqHeaders).catch(() => ({ data: [] })),
          axios.get('https://meal-kit-ecommerce.onrender.com/api/categories').catch(() => ({ data: [] })),
          axios.get('https://meal-kit-ecommerce.onrender.com/api/products').catch(() => ({ data: [] })),
          axios.get('https://meal-kit-ecommerce.onrender.com/api/auth/users', reqHeaders).catch(() => ({ data: [] }))
        ]);
        setAllOrders(oRes.data);
        setMealCats(cRes.data);
        setMenuItems(pRes.data);
        setSiteUsers(uRes.data);
      } catch (err) { 
        console.log("couldn't fetch admin data", err); 
      }
    }
  };

  useEffect(() => { 
    loadDashboardInfo(); 
  }, [user]);

  // stats
  const totalIncome = allOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const activeMealsCount = menuItems.length;
  const usersCount = siteUsers.length;

  const submitNewMeal = async (e) => {
    e.preventDefault();
    if (!uploadedImg || !selectedCatId) {
      return notify({ title: "Missing fields", status: "warning" });
    }
    
    setLoadingMeal(true);
    try {
      const data = new FormData();
      data.append('name', mealName); 
      data.append('price', mealPrice);
      data.append('description', mealDesc); 
      data.append('categoryId', selectedCatId); 
      data.append('image', uploadedImg); 

      const res = await axios.post('https://meal-kit-ecommerce.onrender.com/api/products', data, {
        headers: { ...reqHeaders.headers, 'Content-Type': 'multipart/form-data' },
      });
      
      setMenuItems([res.data, ...menuItems]); 
      notify({ title: "Meal added!", status: "success", duration: 3000 });
      
      // reset form
      setMealName(''); setMealPrice(''); setMealDesc(''); setUploadedImg(null); setSelectedCatId('');
      document.getElementById('img-upload').value = '';
    } catch (err) { 
      notify({ title: "Failed", description: err.response?.data?.message, status: "error" }); 
    } finally { 
      setLoadingMeal(false); 
    }
  };

  const removeMeal = async (id) => {
    if (!window.confirm("Drop this meal?")) return;
    try {
      await axios.delete(`https://meal-kit-ecommerce.onrender.com/api/products/${id}`, reqHeaders);
      setMenuItems(menuItems.filter(m => m._id !== id));
      notify({ title: "Removed successfully", status: "info" });
    } catch (err) { 
      notify({ title: "Error deleting", status: "error" }); 
    }
  };

  const triggerMealEdit = (meal) => {
    setActiveMeal({ id: meal._id, name: meal.name, price: meal.price, description: meal.description, categoryId: meal.categoryId });
    setNewMealImg(null);
    openMealModal();
  };

  const saveMealChanges = async () => {
    try {
      const payload = new FormData();
      payload.append('name', activeMeal.name); 
      payload.append('price', activeMeal.price);
      payload.append('description', activeMeal.description); 
      payload.append('categoryId', activeMeal.categoryId);
      if (newMealImg) payload.append('image', newMealImg);

      const res = await axios.put(`https://meal-kit-ecommerce.onrender.com/api/products/${activeMeal.id}`, payload, {
        headers: { ...reqHeaders.headers, 'Content-Type': 'multipart/form-data' },
      });
      
      setMenuItems(menuItems.map(m => m._id === activeMeal.id ? res.data : m));
      closeMealModal();
      notify({ title: "Saved!", status: "success" });
    } catch (err) { 
      notify({ title: "Update failed", status: "error" }); 
    }
  };

  const createCategory = async () => {
    if (!catInput.trim()) return;
    setLoadingCat(true);
    try {
      const res = await axios.post('https://meal-kit-ecommerce.onrender.com/api/categories', { name: catInput }, reqHeaders);
      setMealCats([...mealCats, res.data]); 
      setCatInput('');
      notify({ title: "Added category", status: "success" });
    } catch (err) { 
      notify({ title: "Oops", status: "error" }); 
    } finally { 
      setLoadingCat(false); 
    }
  };

  const dropCategory = async (id) => {
    if (!window.confirm("Delete this?")) return;
    try {
      await axios.delete(`https://meal-kit-ecommerce.onrender.com/api/categories/${id}`, reqHeaders);
      setMealCats(mealCats.filter(c => c._id !== id));
    } catch (err) { 
      notify({ title: "Error", status: "error" }); 
    }
  };

  const saveCategory = async () => {
    if (!editingCat.title.trim()) return;
    try {
      const res = await axios.put(`https://meal-kit-ecommerce.onrender.com/api/categories/${editingCat.id}`, { name: editingCat.title }, reqHeaders);
      setMealCats(mealCats.map(c => c._id === editingCat.id ? res.data : c));
      closeCatModal(); 
    } catch (err) { 
      console.log(err); 
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Box minH="100vh" bg="orange.50" py={10} px={4}>
      <Box maxW="7xl" mx="auto">
        
        <Flex justify="space-between" align="flex-end" mb={8}>
          <Box>
            <Text color="orange.500" fontWeight="bold" letterSpacing="wider" textTransform="uppercase" fontSize="sm">
              Overview
            </Text>
            <Heading color="gray.800" size="xl">Welcome back, Chef {user.name.split(' ')[0]} 👋</Heading>
          </Box>
          <Badge colorScheme="orange" p={2} borderRadius="lg" fontSize="sm">Admin Status: Active</Badge>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          <CustomCard borderTopWidth="4px" borderTopColor="orange.400">
            <Stat>
              <StatLabel color="gray.500" fontSize="md">Total Revenue</StatLabel>
              <StatNumber color="gray.800" fontSize="3xl">${totalIncome.toFixed(2)}</StatNumber>
              <StatHelpText color="green.500" fontWeight="bold">↑ Growing fast</StatHelpText>
            </Stat>
          </CustomCard>
          <CustomCard borderTopWidth="4px" borderTopColor="orange.400">
            <Stat>
              <StatLabel color="gray.500" fontSize="md">Active Meals</StatLabel>
              <StatNumber color="gray.800" fontSize="3xl">{activeMealsCount}</StatNumber>
              <StatHelpText color="orange.500">On your menu</StatHelpText>
            </Stat>
          </CustomCard>
          <CustomCard borderTopWidth="4px" borderTopColor="orange.400">
            <Stat>
              <StatLabel color="gray.500" fontSize="md">Happy Customers</StatLabel>
              <StatNumber color="gray.800" fontSize="3xl">{usersCount}</StatNumber>
              <StatHelpText color="blue.500">Registered users</StatHelpText>
            </Stat>
          </CustomCard>
        </SimpleGrid>

        <CustomCard p={2}>
          <Tabs colorScheme="orange" variant="soft-rounded" isLazy>
            <TabList px={4} py={2} overflowX="auto">
              <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'orange.500' }}>Orders 📦</Tab>
              <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'orange.500' }}>Add Meal ➕</Tab>
              <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'orange.500' }}>Menu 🍔</Tab> 
              <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'orange.500' }}>Categories 📁</Tab> 
              <Tab fontWeight="bold" _selected={{ color: 'white', bg: 'orange.500' }}>Users 👥</Tab>
            </TabList>

            <Box p={6}>
              <TabPanels>
                
                <TabPanel p={0}>
                  {allOrders.length === 0 ? (
                    <Text textAlign="center" py={10} color="gray.400" fontSize="lg">No orders yet.</Text>
                  ) : (
                    <Box overflowX="auto" borderRadius="xl" borderWidth="1px" borderColor="gray.100">
                      <Table variant="simple">
                        <Thead bg="orange.50"><Tr><Th>Order ID</Th><Th>Customer</Th><Th>Date</Th><Th isNumeric>Total</Th><Th>Status</Th></Tr></Thead>
                        <Tbody>
                          {allOrders.map(o => (
                            <Tr key={o._id} _hover={{ bg: "gray.50" }}>
                              <Td fontWeight="medium" color="gray.600">{o.orderNumber}</Td>
                              <Td>
                                <Text fontWeight="bold" color="gray.800">{o.user?.name}</Text>
                                <Text fontSize="xs" color="gray.500">{o.user?.email}</Text>
                              </Td>
                              <Td color="gray.600">{new Date(o.createdAt).toLocaleDateString()}</Td>
                              <Td isNumeric fontWeight="bold" color="orange.500">${o.totalPrice?.toFixed(2)}</Td>
                              <Td><Badge colorScheme={o.paymentStatus === 'Paid' ? 'green' : 'yellow'} borderRadius="full" px={2}>{o.paymentStatus || 'Pending'}</Badge></Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel p={0}>
                  <Box maxW="2xl" mx="auto">
                    <Heading size="md" mb={6} color="gray.700">Craft a New Recipe</Heading>
                    <form onSubmit={submitNewMeal}>
                      <VStack spacing={5}>
                        <FormControl isRequired>
                          <FormLabel fontWeight="bold" color="gray.600">Meal Name</FormLabel>
                          <Input value={mealName} onChange={(e)=>setMealName(e.target.value)} bg="gray.50" border="none" _focus={{ ring: 2, ringColor: "orange.400" }} size="lg" />
                        </FormControl>

                        <Flex w="full" gap={4}>
                          <FormControl isRequired>
                            <FormLabel fontWeight="bold" color="gray.600">Price ($)</FormLabel>
                            <Input type="number" step="0.01" value={mealPrice} onChange={(e)=>setMealPrice(e.target.value)} bg="gray.50" border="none" _focus={{ ring: 2, ringColor: "orange.400" }} size="lg" />
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel fontWeight="bold" color="gray.600">Category</FormLabel>
                            <Select value={selectedCatId} onChange={(e)=>setSelectedCatId(e.target.value)} bg="gray.50" border="none" _focus={{ ring: 2, ringColor: "orange.400" }} size="lg">
                              <option value="" disabled>Select a category</option>
                              {mealCats.map((cat) => <option key={cat._id} value={cat._id}>{cat.title}</option>)}
                            </Select>
                          </FormControl>
                        </Flex>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold" color="gray.600">Description</FormLabel>
                          <Textarea value={mealDesc} onChange={(e)=>setMealDesc(e.target.value)} bg="gray.50" border="none" _focus={{ ring: 2, ringColor: "orange.400" }} size="lg" rows={4}/>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontWeight="bold" color="gray.600">Image</FormLabel>
                          <Box border="2px dashed" borderColor="orange.200" borderRadius="xl" p={4} bg="orange.50" textAlign="center">
                            <Input id="img-upload" type="file" accept="image/*" onChange={(e)=>setUploadedImg(e.target.files[0])} border="none" p={1} cursor="pointer" />
                          </Box>
                        </FormControl>

                        <Button type="submit" colorScheme="orange" size="lg" w="full" h="60px" borderRadius="xl" isLoading={loadingMeal}>
                          Publish to Menu
                        </Button>
                      </VStack>
                    </form>
                  </Box>
                </TabPanel>

                <TabPanel p={0}>
                  {menuItems.length === 0 ? (
                    <Text textAlign="center" py={10} color="gray.400">Empty menu.</Text>
                  ) : (
                    <Box overflowX="auto" borderRadius="xl" borderWidth="1px" borderColor="gray.100">
                      <Table variant="simple">
                        <Thead bg="orange.50"><Tr><Th>Photo</Th><Th>Name</Th><Th>Price</Th><Th textAlign="right">Actions</Th></Tr></Thead>
                        <Tbody>
                          {menuItems.map(p => (
                            <Tr key={p._id} _hover={{ bg: "gray.50" }}>
                              <Td><Image src={p.imageUrl} boxSize="60px" objectFit="cover" borderRadius="lg"/></Td>
                              <Td fontWeight="bold" color="gray.700">{p.name}</Td>
                              <Td color="orange.500" fontWeight="bold">${p.price?.toFixed(2)}</Td>
                              <Td textAlign="right">
                                <Button size="sm" colorScheme="blue" variant="ghost" mr={2} onClick={() => triggerMealEdit(p)}>Edit</Button>
                                <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeMeal(p._id)}>Remove</Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel p={0}>
                  <Box maxW="3xl" mx="auto">
                    <Flex mb={8} gap={4} bg="orange.50" p={4} borderRadius="xl">
                      <Input placeholder="New category..." value={catInput} onChange={(e)=>setCatInput(e.target.value)} bg="white" border="none" size="lg" />
                      <Button colorScheme="orange" size="lg" px={8} onClick={createCategory} isLoading={loadingCat}>Add</Button>
                    </Flex>
                    <Box borderRadius="xl" borderWidth="1px" borderColor="gray.100" overflow="hidden">
                      <Table variant="simple">
                        <Tbody>
                          {mealCats.map(c => (
                            <Tr key={c._id} _hover={{ bg: "gray.50" }}>
                              <Td fontWeight="bold" color="gray.700">{c.title}</Td>
                              <Td textAlign="right">
                                <Button size="sm" colorScheme="blue" variant="ghost" mr={2} onClick={()=>{setEditingCat({id:c._id,title:c.title}); openCatModal();}}>Edit</Button>
                                <Button size="sm" colorScheme="red" variant="ghost" onClick={()=>dropCategory(c._id)}>Delete</Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                </TabPanel>

                <TabPanel p={0}>
                  <Box overflowX="auto" borderRadius="xl" borderWidth="1px" borderColor="gray.100">
                    <Table variant="simple">
                      <Thead bg="orange.50"><Tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Joined Date</Th></Tr></Thead>
                      <Tbody>
                        {siteUsers.map(u => (
                          <Tr key={u._id}>
                            <Td fontWeight="bold">{u.name}</Td>
                            <Td>{u.email}</Td>
                            <Td><Badge colorScheme={u.role==='admin'?'orange':'green'}>{u.role}</Badge></Td>
                            <Td>{new Date(u.createdAt).toLocaleDateString()}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>

              </TabPanels>
            </Box>
          </Tabs>
        </CustomCard>

      </Box>

      <Modal isOpen={catModalOpen} onClose={closeCatModal} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input size="lg" value={editingCat.title} onChange={(e)=>setEditingCat({...editingCat,title:e.target.value})} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeCatModal}>Cancel</Button>
            <Button colorScheme="orange" onClick={saveCategory}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* meal edit modal */}
      <Modal isOpen={mealModalOpen} onClose={closeMealModal} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Update Recipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl><FormLabel>Name</FormLabel><Input value={activeMeal.name} onChange={(e)=>setActiveMeal({...activeMeal,name:e.target.value})}/></FormControl>
              <FormControl><FormLabel>Price</FormLabel><Input type="number" value={activeMeal.price} onChange={(e)=>setActiveMeal({...activeMeal,price:e.target.value})}/></FormControl>
              <FormControl><FormLabel>Category</FormLabel>
                <Select value={activeMeal.categoryId} onChange={(e)=>setActiveMeal({...activeMeal,categoryId:e.target.value})}>
                  {mealCats.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </Select>
              </FormControl>
              <FormControl><FormLabel>Details</FormLabel><Textarea value={activeMeal.description} onChange={(e)=>setActiveMeal({...activeMeal,description:e.target.value})}/></FormControl>
              <FormControl><FormLabel>New Photo?</FormLabel>
                <Input type="file" accept="image/*" onChange={(e)=>setNewMealImg(e.target.files[0])} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeMealModal}>Cancel</Button>
            <Button colorScheme="orange" onClick={saveMealChanges}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default AdminDashboard;