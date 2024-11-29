const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    productName: { type: String, required: true },
    productDescription: { type: String },
    productPrice: { type: Number, required: true },
    productStock: { type: String },
    productCategoryID: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    productDiscount: { type: Number, default: 0 },
    productBrand: { type: Number ,required: false},
    productImageURL: { type: String }
});

const products = mongoose.model('products', productsSchema);
module.exports = products;