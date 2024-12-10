const express = require('express');
const Product = require('../models/products');

const router = express.Router();

router.get ('/slider', async (req, res) => {
    try {
      const products = await Product.aggregate([{ $sample: { size: 5 } }]);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;
