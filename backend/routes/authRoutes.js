const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/users');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    const { userMail, userPassword } = req.body;
  
    // Gerekli alanları kontrol et
    if (!userMail || !userPassword) {
      return res.status(400).json({ success: false, message: 'mail ve şifre gereklidir!' });
    }
  
    try {
      // Kullanıcıyı bul
      const user = await users.findOne({ userMail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı!' });
      }
  
      // Şifreyi doğrula
      const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Şifre yanlış!' });
      }
  
      // Token oluştur
      const token = jwt.sign(
        {
          id: user._id,
          userName: user.userName,
          isAdmin: user.isAdmin,
        },
        process.env.SECRET_KEY || 'kXOAcdo9GyW7mNj3t', 
        { expiresIn: '3h' }
      );
      // Başarılı yanıt
      res.status(200).json({
        success: true,
        message: 'Giriş başarılı!',
        token,
        user: {
          id: user._id,
          userName: user.userName,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
  });

// Register
router.post('/register', async (req, res) => {
    const { userName, userSurname, userTC, userPassword, userMail, userTel, isAdmin } = req.body;
  
    // Eksik alan kontrolü
    if (!userName || !userSurname || !userTC || !userPassword) {
      return res.status(400).json({ success: false, message: 'Gerekli alanlar eksik!' });
    }
  
    try {
      // Şifreyi kontrol et
      console.log('Password to hash:', userPassword);
      if (!userPassword) {
        return res.status(400).json({ success: false, message: 'Şifre eksik!' });
      }
  
      // Kullanıcı kontrolü
      const existingUser = await users.findOne({ userTC });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Bu TC kimlik numarasıyla zaten bir kullanıcı kayıtlı!' });
      }
  
      // Şifreyi hash'le
      const hashedPassword = await bcrypt.hash(userPassword, 10);
  
      // Yeni kullanıcı oluştur
      const newUser = new users({
        userName,
        userSurname,
        userTC,
        userPassword: hashedPassword,
        userMail,
        userTel,
        isAdmin: isAdmin || false,
      });
  
      // Kaydet
      await newUser.save();
  
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          userName: newUser.userName,
          userSurname: newUser.userSurname,
          userMail: newUser.userMail,
          userTel: newUser.userTel,
          isAdmin: newUser.isAdmin,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Sunucu hatası!' });
    }
  });

module.exports = router;