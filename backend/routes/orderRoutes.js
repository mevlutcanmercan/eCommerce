const express = require('express');
const orders = require('../models/orders');
const { authenticate } = require('./middlewares/auth');
require('dotenv').config();

const router = express.Router();


router.post('/addorder', authenticate, async (req, res) => {
    try {
        const { orderShippingString, orderCardNumber, orderQuantity, orderTotalPrice } = req.body;
    
        const userId = req.user.id;
    
        const lastOrder = await orders.findOne().sort({ orderID: -1 });
        const nextOrderID = lastOrder ? lastOrder.orderID + 1 : 1;
    
        const newOrder = new orders({
          orderID: nextOrderID,
          orderShippingString,
          orderCardNumber,
          orderQuantity,
          orderTotalPrice,
          orderUserID: userId
        });
    
        await newOrder.save();
        res.status(201).json({ message: 'Order added successfully', order: newOrder });
      } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
});
router.get('/orderbyuser', authenticate, async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const userOrders = await orders.find({ orderUserID: userId });
      res.status(200).json(userOrders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router;
