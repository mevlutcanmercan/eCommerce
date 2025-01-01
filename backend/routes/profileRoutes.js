const express = require('express');
const users = require('../models/users');
const { authenticate } = require('./middlewares/auth');
require('dotenv').config();

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log('Decoded User ID:', userId); 
    const user = await users.findById(userId).select('-userPassword');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Profil alınamadı', error });
  }
});

router.post('/profile/change-password', authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    try {
      const user = await users.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }
  
      const isPasswordValid = await bcrypt.compare(currentPassword, user.userPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Mevcut şifre yanlış' });
      }
  
      user.userPassword = newPassword;
      await user.save();
  
      res.json({ message: 'Şifre başarıyla değiştirildi' });
    } catch (error) {
      res.status(500).json({ message: 'Şifre değiştirilemedi', error });
    }
  });

module.exports = router;
