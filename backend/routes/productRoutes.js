const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct, updateProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/cloudinaryConfig');

router.get('/', getProducts);

router.post('/', protect, admin, upload.single('image'), addProduct);

router.delete('/:id', protect, admin, deleteProduct);

router.put('/:id', protect, admin, upload.single('image'), updateProduct);

module.exports = router;