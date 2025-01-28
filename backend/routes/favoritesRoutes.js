const express = require('express');
const favorites = require('../models/favorites');
const { authenticate } = require('./middlewares/auth');
require('dotenv').config();

const router = express.Router();


module.exports = router;
