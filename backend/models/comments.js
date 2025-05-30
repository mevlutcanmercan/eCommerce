const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'users'}, 
    comment: { type: String },
    rate: { type: Number },
    productID: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    approvalStatus: {type: Boolean, required:true, default:false}
});

const comments = mongoose.model('comments', commentsSchema);
module.exports = comments;