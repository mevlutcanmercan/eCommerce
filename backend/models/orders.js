const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    orderID: { type: Number, required: true },
    orderShippingString: { type: String, required: true},
    orderCardNumber: { type: String, required: true},
    orderQuantity: { type: Number, required: false},
    orderTotalPrice: { type: Number, required: true },
    orderUserID: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

const orders = mongoose.model('orders', ordersSchema);
module.exports = orders;