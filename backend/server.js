
const express = require('express');
const cors =require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Meal-Kit Server is Running');
});

const PORT = process.env.PORT ;
//! route for auth
app.use('/api/auth', require('./routes/authRoutes'));
//! route for products
app.use('/api/products', require('./routes/productRoutes'));
//! route for orders
app.use("/api/orders",require('./routes/orderRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'));
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.log(`Error in connection: ${error.message}`);
  }
};

connectDB();



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});