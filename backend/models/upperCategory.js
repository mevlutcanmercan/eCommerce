const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const upperCategoriesSchema = new Schema({
    upperCategories_Name: { type: String, required: true }
});

const upperCategories = mongoose.model('upperCategories', upperCategoriesSchema);
module.exports = upperCategories;
