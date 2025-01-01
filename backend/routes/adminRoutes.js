const express = require('express');
const Product = require('../models/products');
const Users = require('../models/users')
const { authenticate, authorizeAdmin } = require('./middlewares/auth');

const router = express.Router();

// Ürünleri getir
router.get('/admin/products', authenticate, authorizeAdmin, async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  
  // Belirli bir ürünü getir
  router.get('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
    const productId = req.params.productId;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });
  
  router.post('/admin/products', authenticate, authorizeAdmin, async (req, res) => {
    const { productName, productDescription, productPrice, productCategoryID, productStock, productDiscount, productBrand, productImageURL } = req.body;
  
    try {
      const newProduct = new Product({
        productName,
        productDescription,
        productPrice,
        productCategoryID,
        productStock,
        productDiscount,
        productBrand,
        productImageURL
      });
  
      await newProduct.save();
      res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
      console.error('Error adding product:', error.message);
      res.status(500).json({ error: 'Failed to add product' });
    }
  });
  
  // Ürün güncelle
  router.put('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
    const productId = req.params.productId;
    const { productName, productDescription, productPrice, productCategoryID, productStock, productDiscount, productBrand, productImageURL } = req.body;
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        productName,
        productDescription,
        productPrice,
        productCategoryID,
        productStock,
        productDiscount,
        productBrand,
        productImageURL 
      }, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
  
  
  
  router.delete('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
    const productId = req.params.productId;
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(201).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  router.get('/admin/users', authenticate, authorizeAdmin, async (req, res) => {
    try {
      const users = await Users.find();
      res.status(200).json(users); 
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
 
  module.exports = router;
