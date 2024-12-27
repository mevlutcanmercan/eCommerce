const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productFeaturesSchema = new Schema({
    productID: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    featureID: { type: Schema.Types.ObjectId, ref: 'features', required: true },
    featureValue: { type: String, required: true } 
});

const productFeatures = mongoose.model('productfeatures', productFeaturesSchema);
module.exports = productFeatures;

