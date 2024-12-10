const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Token eksik veya format hatası!' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY || 'kXOAcdo9GyW7mNj3t', (err, decoded) => {
    if (err) {
      console.error('JWT Error:', err.name, err.message);
      return res.status(403).json({ message: err.message });
    }
    req.user = decoded;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Admins only.' });
  }
};

module.exports = { authenticate, authorizeAdmin };

