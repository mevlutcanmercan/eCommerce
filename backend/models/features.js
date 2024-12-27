const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featuresSchema = new Schema({
    featureName: { type: String, required: true },
    featureValues: { type: String, required: true }
});

const features = mongoose.model('features', featuresSchema);
module.exports = features;