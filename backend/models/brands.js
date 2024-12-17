const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandsSchema = new Schema({
    brandName: { type: String, required: true }
});

const brands = mongoose.model('brands', brandsSchema);
module.exports = brands;