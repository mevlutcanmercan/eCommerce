const express = require('express');
const Product = require('../models/products');
const Category = require('../models/category');
const UpperCategory = require('../models/upperCategory');

const router = express.Router();

router.get('/search', async (req, res) => {
    const query = req.query.q || ''; 
    if (!query) {
      return res.status(400).json({ success: false, message: 'Arama sorgusu boş olamaz!' });
    }
  
    try {
      const products = await Product.find({
        productName: { $regex: query, $options: 'i' },
      })
        .limit(5)
        .select('productName productImageURL productPrice'); // Yalnızca gerekli alanları döndür
  
      // Kategorilerde arama
      const categories = await Category.find({
        category_Name: { $regex: query, $options: 'i' },
      }).limit(5);
      
      res.status(200).json({
        success: true,
        data: {
          products,
          categories,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Sunucu hatası!', error: err });
    }
  });

module.exports = router;
