const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/products');
const Features = require('../models/features');
const ProductFeatures = require('../models/productFeatures');

const router = express.Router();


router.get('/features', async (req, res) => {
  try {
    const features = await Features.find();
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }
});

router.get('/feature/:featureId', async (req, res) => {
  const { featureId } = req.params;
  try {
      const feature = await Features.findById(featureId);
      if (!feature) {
          return res.status(404).json({
              success: false,
              message: 'Feature cannot be found!'
          });
      }
      res.status(200).json({
          success: true,
          data: feature
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: 'server error!',
          error: err.message
      });
  }
});


router.get('/features/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
      const productFeatures = await ProductFeatures.find({ productID: productId }).populate('featureID');

      if (productFeatures.length === 0) {
          return res.status(404).json({
              success: false,
              message: 'Feature cannot be found.'
          });
      }

      const featureDetails = await Promise.all(
          productFeatures.map(async (productFeature) => {
              const feature = await Features.findById(productFeature.featureID);
              return {
                  featureName: feature.featureName,
                  featureValue: productFeature.featureValue
              };
          })
      );

      res.status(200).json({
          success: true,
          data: featureDetails
      });

  } catch (error) {
      console.error('Error fetching product features:', error);
      res.status(500).json({
          success: false,
          message: 'Cannot reach the feature.',
          error: error.message
      });
  }
});


router.post('/features/assign', async (req, res) => {
  const { productID, featureID, featureValue } = req.body;

  if (!productID || !featureID || !featureValue) {
      return res.status(400).json({
          success: false,
          message: 'productID, featureID and featureValue is mandatory.'
      });
  }

  try {
      const newProductFeature = new ProductFeatures({
          productID,
          featureID,
          featureValue
      });

      // Veritabanına kaydet
      await newProductFeature.save();

      res.status(201).json({
          success: true,
          message: 'Feature added successfully.',
          data: newProductFeature
      });
  } catch (error) {
      console.error('Error assigning feature to product:', error);
      res.status(500).json({
          success: false,
          message: 'Feature cannot be added.',
          error: error.message
      });
  }
});

router.get('/featurecategory/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
  
    try {
      const products = await ProductFeatures.find()
        .populate({
          path: 'productID',
          match: { productCategoryID: categoryId }, // Kategori filtresi
          populate: {
            path: 'productCategoryID',
            select: 'category_Name' // Sadece kategori adını getir
          }
        })
        .populate({
          path: 'featureID',
          select: 'featureName featureValues' // Özellik bilgilerini al
        });
  
      // Boş olanları filtreleme
      const filteredProducts = products.filter(p => p.productID);
  
      res.status(200).json({
        success: true,
        data: filteredProducts
      });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ error: 'Failed to fetch products by category' });
    }
  });





router.get('/features/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    try {
      // Kategoriye ait tüm ürünleri bulun
      const products = await Product.find({ productCategoryID: categoryId }).select('_id');
      const productIds = products.map(product => product._id);
  
      if (productIds.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: 'Kategoriye ait ürün bulunamadı.',
        });
      }
  
      // ProductFeatures üzerinden özellikleri filtrele
      const productFeatures = await ProductFeatures.find({ productID: { $in: productIds } })
        .populate({
          path: 'featureID',
          select: 'featureName featureValues',
        });
  
      if (productFeatures.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: 'Bu kategoride özellik yok.',
        });
      }
  
      // Özellikleri geçerli değerlere göre düzenle
      const featuresMap = {};
      productFeatures.forEach((pf) => {
        const featureID = pf.featureID._id.toString();
        if (!featuresMap[featureID]) {
          featuresMap[featureID] = {
            _id: pf.featureID._id,
            featureName: pf.featureID.featureName,
            featureValues: new Set(),
          };
        }
        featuresMap[featureID].featureValues.add(pf.featureValue);
      });
  
      // Map'i düz bir diziye çevirin ve Set'i Array'e dönüştürün
      const validFeatures = Object.values(featuresMap).map((feature) => ({
        _id: feature._id,
        featureName: feature.featureName,
        featureValues: JSON.stringify(Array.from(feature.featureValues)),
      }));
      
  
      res.status(200).json({ success: true, data: validFeatures });
    } catch (error) {
      console.error('Error fetching features by category:', error);
      res.status(500).json({ error: 'Failed to fetch features' });
    }
});


/*
  const { categoryId } = req.params;

  try {
    // Kategoriye ait tüm ürünleri bulun
    const products = await Product.find({ productCategoryID: categoryId }).select('_id');
    const productIds = products.map(product => product._id);

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Kategoriye ait ürün bulunamadı.',
      });
    }

    // ProductFeatures üzerinden özellikleri filtrele
    const productFeatures = await ProductFeatures.find({ productID: { $in: productIds } })
      .populate({
        path: 'featureID',
        select: 'featureName featureValues',
      });

    if (productFeatures.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Bu kategoride özellik yok.',
      });
    }

    // Özellikleri geçerli değerlere göre düzenle
    const featuresMap = {};
    productFeatures.forEach((pf) => {
      const featureID = pf.featureID._id.toString();
      if (!featuresMap[featureID]) {
        featuresMap[featureID] = {
          _id: pf.featureID._id,
          featureName: pf.featureID.featureName,
          featureValues: new Set(),
        };
      }
      featuresMap[featureID].featureValues.add(pf.featureValue);
    });

    // Map'i düz bir diziye çevirin ve Set'i Array'e dönüştürün
    const validFeatures = Object.values(featuresMap).map((feature) => ({
      _id: feature._id,
      featureName: feature.featureName,
      featureValues: JSON.stringify(Array.from(feature.featureValues)),
    }));
    

    res.status(200).json({ success: true, data: validFeatures });
  } catch (error) {
    console.error('Error fetching features by category:', error);
    res.status(500).json({ error: 'Failed to fetch features' });
  }


*/



router.get('/filtered-products', async (req, res) => {
  const { categoryId, filters } = req.query;
  console.log('Received Filters:', filters); // Gelen filtreleri kontrol edin

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: 'categoryId is required.',
    });
  }

  try {
    const parsedFilters = filters ? JSON.parse(filters) : null;

    // Filtrelerin doğru formatta olduğundan emin olun
    Object.keys(parsedFilters || {}).forEach((key) => {
      parsedFilters[key] = parsedFilters[key].map((value) =>
        value.replace(/^"|"$/g, '').trim()
      );
    });
    console.log('Received Filters:', parsedFilters); // Gelen filtreleri kontrol edin

    const productsInCategory = await Product.find({ productCategoryID: categoryId });
    const productIds = productsInCategory.map((product) => product._id);

    if (!parsedFilters || Object.keys(parsedFilters).length === 0) {
      return res.status(200).json({
        success: true,
        data: productsInCategory,
      });
    }

    const filterConditions = Object.entries(parsedFilters).map(([featureID, values]) => ({
      featureID: featureID,
      featureValue: { $in: values },
      productID: { $in: productIds },
    }));

    const productFeatures = await ProductFeatures.find({ $or: filterConditions });

    const productMatchCount = productFeatures.reduce((acc, feature) => {
      const productId = feature.productID.toString();
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {});

    const requiredMatchCount = Object.keys(parsedFilters).length;
    const matchedProductIds = Object.keys(productMatchCount).filter(
      (productId) => productMatchCount[productId] === requiredMatchCount
    );

    const uniqueProducts = await Product.find({ _id: { $in: matchedProductIds } });

    res.status(200).json({
      success: true,
      data: uniqueProducts,
    });
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered products.',
      error: error.message,
    });
  }
});
  
  
  
  
module.exports = router;

