const Order = require("../models/Order");
const Product = require("../models/Product");

const sendEmail = require("../routes/sendEmail"); 

const addOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
     
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide shipping address and payment method' });
    }

    let calculatedTotalPrice = 0;
    let itemsHtml = ''; 

    for(const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if(dbProduct) {
          const itemTotal = (dbProduct.price * item.quantity);
          calculatedTotalPrice += itemTotal;
          
          itemsHtml += `
            <div style="border-bottom: 1px dashed #ccc; padding: 8px 0; font-size: 15px;">
              <span style="font-weight: bold; color: #DD6B20;">${item.quantity}x</span> ${dbProduct.name} 
              <span style="float: right; font-weight: bold;">$${itemTotal.toFixed(2)}</span>
            </div>
          `;
      } else {
          return res.status(404).json({ message: `Product not found for ID: ${item.productId}` });
      }
    }

    const order = await Order.create({
      orderNumber: `ORD-${Date.now()}`, 
      user: req.user._id, 
      items,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice
    });
 
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2 style="color: #DD6B20; text-align: center;">Order Confirmed! 🍔</h2>
          <p style="font-size: 16px;">Hello <b>${req.user.name || 'Customer'}</b>,</p>
          <p>We've received your order and our chefs are getting your meal kit ready.</p>
          
          <h3 style="border-bottom: 2px solid #DD6B20; padding-bottom: 5px;">Order Items</h3>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            ${itemsHtml}
          </div>

          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p style="margin-top: 15px; font-size: 18px;">
            <strong>Total Amount:</strong> <span style="color: #DD6B20; font-weight: bold;">$${order.totalPrice.toFixed(2)}</span>
          </p>
          
          <h3 style="border-bottom: 2px solid #DD6B20; padding-bottom: 5px; margin-top: 25px;">Shipping To</h3>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.street} ${order.shippingAddress.building ? '- ' + order.shippingAddress.building : ''}</p>
          
          <br/>
          <p style="text-align: center; color: #718096; font-size: 14px;">Thank you for cooking with MEAL-KIT!</p>
        </div>
      `;

      await sendEmail({
        email: req.user.email,
        subject: `Your MEAL-KIT Receipt - ${order.orderNumber}`,
        html: emailHtml
      });
      console.log("Detailed Order confirmation email sent successfully!");
    } catch (emailError) {
      console.error("Failed to send order email:", emailError);
    }

    return res.status(201).json(order);

  } catch(err) {
    res.status(500).json({message: err.message});
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { addOrder, getMyOrders, getAllOrders };