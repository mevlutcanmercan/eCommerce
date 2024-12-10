const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const upperCategorySchema = new Schema({
    upperCategories_Name: { type: String, required: true }
});

const upperCategory = mongoose.model('upperCategory', upperCategorySchema);
module.exports = upperCategory;
