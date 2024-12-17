const express = require('express');
const Product = require('../models/products');
const Brands = require('../models/brands');
const router = express.Router();


router.get('/brands', async (req, res) => {
    try {
      const brands = await Brands.find();
      res.json(brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      res.status(500).json({ error: 'Failed to fetch brands' });
    }
  });

  router.get('/brands/:brandId', async (req, res) => {
    const brandId = req.params.brandId;
    try {
      const productsByBrands = await Product.find({ productBrand: brandId });
      res.json(productsByBrands);
    } catch (error) {
      console.error('Error fetching products By Brands:', error);
      res.status(500).json({ error: 'Failed to fetch products By Brands' });
    }
  });
  module.exports = router;
