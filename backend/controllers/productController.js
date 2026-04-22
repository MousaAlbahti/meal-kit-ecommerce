const Products = require("../models/Product");

const addProduct = async (req, res) => {
  try {
  
    const { name, price, description, image, categoryId } = req.body;
const imageUrl = req.file ? req.file.path : req.body.image;
    if (!name || !description || !price || !imageUrl) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const slug = name.toLowerCase().replace(/ /g, '-'); 
    
    const stock = 50; 

    const product = await Products.create({
      name,
      slug,
      description,
      price,
      stock,
      categoryId: categoryId || null,
      imageUrl: imageUrl, 
      createdBy: req.user._id 
    });

    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Products.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    const product = await Products.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.categoryId = categoryId || product.categoryId;
    
    if (req.file) {
      product.imageUrl = req.file.path;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct, getProducts ,addProduct, getProducts, deleteProduct, updateProduct};