const dbURI = 'mongodb+srv://mevlutcanmercan55:bBDqWubd7igrqqCV@ecommercecluster.odkhm.mongodb.net/eCommerceDB?retryWrites=true&w=majority&appName=eCommerceCluster'; 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const productRoutes = require('./routes/productRoutes');
const generalRoutes = require('./routes/generalRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); 
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const brandsRoutes = require('./routes/brandsRoutes');  
const featureRoutes = require('./routes/featureRoutes');  
const paymentRoutes = require('./routes/paymentRoutes');  

const app = express();
const PORT = 3000;

mongoose.connect(dbURI
)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('', authRoutes);
app.use('', profileRoutes);
app.use('', productRoutes);
app.use('', generalRoutes);
app.use('', categoryRoutes);
app.use('', commentRoutes);
app.use('', adminRoutes);
app.use('', searchRoutes);
app.use('', brandsRoutes);
app.use('', featureRoutes);
app.use('', paymentRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
