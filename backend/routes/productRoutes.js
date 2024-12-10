const express = require('express');
const Product = require('../models/products');
const Category = require('../models/category');
const router = express.Router();


router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const products = await Product.find().skip(skip).limit(limit).populate('productCategoryID');
      const count = await Product.countDocuments();
      const totalPages = Math.ceil(count / limit);
  
      res.json({
        data: products,
        page,
        totalPages,
        total: count
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

router.get('/products/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
      const products = await Product.find({ productCategoryID: categoryId });
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

router.get('/product/:productId', async (req, res) => {   // Buradaki productS olarak düzeltilecek en son 
    const productId = req.params.productId;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

router.get ('/randomProducts', async (req, res) => {
    try {
      const randomCategory = await Category.aggregate([{ $sample: { size: 1 } }]);
      if (randomCategory.length>0) {
        const categoryId = randomCategory[0]._id
  
        const products = await Product.aggregate([
          { $match: { productCategoryID: categoryId } },
          { $sample: { size: 5 } }
        ]);
  
        res.json(products);
      } else {
        res.status(400).json({ message: 'Category Not Found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  module.exports = router;
