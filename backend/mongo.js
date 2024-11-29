const dbURI = 'mongodb+srv://mevlutcanmercan55:bBDqWubd7igrqqCV@ecommercecluster.odkhm.mongodb.net/?retryWrites=true&w=majority&appName=eCommerceCluster'; 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UpperCategory = require('./models/upperCategory');
const Category = require('./models/category');
const users = require('./models/users');
const Product = require('./models/products');
const Comment = require('./models/comments');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(dbURI
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Admins only.' });
  }
};
const SECRET_KEY = '123'; // Güvenli bir şekilde saklayın

app.post('/login', async (req, res) => {
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
      SECRET_KEY,
      { expiresIn: '1h' } // Token süresi (1 saat)
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


app.post('/register', async (req, res) => {
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
      message: 'Kullanıcı başarıyla kaydedildi!',
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

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  jwt.verify(token.split(' ')[1], 'token', (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });

    req.user = decoded;
    next();
  });
};

app.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await users.findById(userId).select('-userPassword');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profil alınamadı', error });
  }
});

app.post('/profile/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;
  try {
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (user.Musteriler_Sifre !== currentPassword) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış' });
    }

    user.Musteriler_Sifre = newPassword;
    await user.save();

    res.json({ message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Şifre değiştirilemedi', error });
  }
});

app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await Product.find().skip(skip).limit(limit).populate('Kategori_id');
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

// Kategorileri getir
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Üst kategorileri getir
app.get('/uppercategories', async (req, res) => {
  try {
    const upperCategories = await UpperCategory.find();
    res.json(upperCategories);
  } catch (error) {
    console.error('Error fetching upper categories:', error);
    res.status(500).json({ error: 'Failed to fetch upper categories' });
  }
});

// Alt kategorileri getir
app.get('/subcategories/:ustKategoriId', async (req, res) => {
  const { ustKategoriId } = req.params;
  if (!ustKategoriId) {
    return res.status(400).json({ error: 'Category ID is required' });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(ustKategoriId);
    const subcategories = await Category.find({ UstKategori_id: objectId });
    res.json(subcategories);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

app.get('/products/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ Kategori_id: categoryId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// Ürünleri getir
app.get('/admin/products', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Belirli bir ürünü getir
app.get('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
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


app.get('/product/:productId', async (req, res) => {
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



app.post('/admin/products', authenticate, authorizeAdmin, async (req, res) => {
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
app.put('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
  const productId = req.params.productId;
  const { Urunler_Adi, Urunler_Aciklama, Urunler_Fiyat, Stok_Adet, Resim_URL, Kategori_id, IndirimOrani, Marka_id } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      Urunler_Adi,
      Urunler_Aciklama,
      Urunler_Fiyat,
      Stok_Adet,
      Resim_URL,
      Kategori_id,
      IndirimOrani,
      Marka_id 
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



app.delete('/admin/products/:productId', authenticate, authorizeAdmin, async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/admin/users', async (req, res) => {
  try {
    const users = await users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get ('/slider', async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 5 } }]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get ('/randomProducts', async (req, res) => {
  try {
    const randomCategory = await Category.aggregate([{ $sample: { size: 1 } }]);
    if (randomCategory.length>0) {
      const categoryId = randomCategory[0]._id

      const products = await Product.aggregate([
        { $match: { Kategori_id: categoryId } },
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


app.post('/product/:productId/addComment', authenticate, async (req, res) => {
  const productId = req.params.productId;
  const { yorum, puan } = req.body;
  const userId = req.user.id;

  try {
    const newComment = new Comment({
      musteri_Id: userId,
      yorum,
      puan,
      urun_Id: productId,
      yorum_Onay: false
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment Success', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.get('/product/:productId/comments', async (req, res) => {
  const productId = req.params.productId;

  try {
    const comments = await Comment.find({ urun_Id: productId, yorum_Onay: true });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.put('/comment/:commentId/approve', authenticate, authorizeAdmin, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { yorum_Onay: true },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(400).json({ error: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ error: 'Failed to approve comment' });
  }
});

app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.delete('/comment/:commentId/delete', authenticate, authorizeAdmin, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(400).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Server'ı başlatma
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});