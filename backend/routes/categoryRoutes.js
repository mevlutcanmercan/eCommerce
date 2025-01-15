const mongoose = require('mongoose');
const express = require('express');
const Category = require('../models/category');
const upperCategory = require('../models/upperCategory');

const router = express.Router();

// Kategorileri getir
router.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });
  
  // Üst kategorileri getir
  router.get('/uppercategories', async (req, res) => {
    try {
      const upperCategories = await upperCategory.find();
      res.json(upperCategories);
    } catch (error) {
      console.error('Error fetching upper categories:', error);
      res.status(500).json({ error: 'Failed to fetch upper categories' });
    }
  });
  
  // Alt kategorileri getir
  router.get('/subcategories/:upperCategories_id', async (req, res) => {
    const { upperCategories_id } = req.params;
    if (!upperCategories_id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }
  
    try {
      const objectId = new mongoose.Types.ObjectId(upperCategories_id);
      const subcategories = await Category.find({ upperCategories_id: objectId });
      res.json(subcategories);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
  });

  router.get('/category/:category_id', async (req, res) => { 
    const category_id = req.params.category_id;
    try {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', err);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  });
  router.get('/uppercategory/:uppercategory_id', async (req, res) => {   
    const uppercategory_id = req.params.uppercategory_id;
    try {
      const uppercategory = await upperCategory.findById(uppercategory_id);
      if (!uppercategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(uppercategory);
    } catch (error) {
      console.error('Error fetching category:', err);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  });


  router.post('/categories/all', async (req, res) => {
    const { categoryIds } = req.body; 
  
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ error: 'Invalid categoryIds' });
    }
  
    try {
      const categories = await Category.find({ _id: { $in: categoryIds } }); 
      res.json(categories); 
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });
  
  router.use(express.json());

  module.exports = router;
