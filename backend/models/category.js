const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    category_Name: { type: String },
    upperCategories_id: { type: mongoose.Schema.Types.ObjectId, ref: 'upperCategory', required: true}
});

const category = mongoose.model('category', categorySchema);
module.exports = category;
