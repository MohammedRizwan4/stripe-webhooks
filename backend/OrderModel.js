const { Schema, model } = require('mongoose');

const orderSchmea = Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    color: {
        type: String
    },
    address: {
        required: true,
        type: Map
    }
},{
    timestamps: true
})

const Order = model('order',orderSchmea);

module.exports = Order;
