const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
    favoritesName: { type: String, required: true, default:'favorites' },
    favoritesIsDefault: { type: Boolean, required: true, default: true},
    favoritesByUser: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    favoritesProducts: [{ type: Schema.Types.ObjectId, ref: 'products', required: false }]  
});

const favorites = mongoose.model('favorites', favoritesSchema);
module.exports = favorites;