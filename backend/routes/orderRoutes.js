const express = require('express');
const router = express.Router();
const { addOrder,getAllOrders,getMyOrders } = require('../controllers/orderController');
const { protect,admin} = require('../middleware/authMiddleware');


router.post('/',protect,addOrder)

router.get('/myorders',protect,getMyOrders)

router.get('/',protect,admin,getAllOrders)
router.get('/all', protect, admin, getAllOrders);

module.exports=router