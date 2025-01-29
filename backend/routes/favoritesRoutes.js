const express = require('express');
const favorites = require('../models/favorites');
const { authenticate } = require('./middlewares/auth');
require('dotenv').config();

const router = express.Router();

router.post('/createdefaultfavorites', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
  
      let defaultFavorites = await favorites.findOne({ favoritesByUser: userId, favoritesIsDefault: true });
  
      if (defaultFavorites) {
        return res.status(200).json({ message: 'Default favorites already exists.', favorites: defaultFavorites });
      }
  
      defaultFavorites = new favorites({
        favoritesByUser: userId,
        favoritesName: 'favorites',
        favoritesIsDefault: true,
      });
  
      await defaultFavorites.save();
  
      res.status(201).json({ message: 'Default favorites list is created successfully.', favorites: defaultFavorites });
    } catch (error) {
      console.error('Error creating/checking default favorites:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

router.post('/addproduct', authenticate, async (req, res) => {
  const { favoritesId, productId } = req.body;

  try {
      const updatedFavorites = await favorites.findByIdAndUpdate(
          favoritesId,
          { $addToSet: { favoritesProducts: productId } }, 
          { new: true }
      );

      if (!updatedFavorites) {
          return res.status(404).json({ message: 'Fav list cannot be found.' });
      }

      res.status(200).json({ message: 'Product added successfully.', favorites: updatedFavorites });
  } catch (error) {
      console.error('Error adding product to favorites:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/removeproduct', authenticate, async (req, res) => {
  const { favoritesId, productId } = req.body;

  try {
      const updatedFavorites = await favorites.findByIdAndUpdate(
          favoritesId,
          { $pull: { favoritesProducts: productId } }, 
          { new: true }
      );

      if (!updatedFavorites) {
          return res.status(404).json({ message: 'Fav list cannot be found.' });
      }

      res.status(200).json({ message: 'Product removed from favs.', favorites: updatedFavorites });
  } catch (error) {
      console.error('Error removing product from favorites:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/favsbyuser', authenticate, async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const userFavs = await favorites.find({ favoritesByUser: userId });
      res.status(200).json(userFavs);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
module.exports = router;
