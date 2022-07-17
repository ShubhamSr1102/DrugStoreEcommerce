const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    drug_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    drug_company:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    drug_code:{
        type: String,
        unique: true,
        required: true
    },
    stocks: {
        type: Number,
        required: true
    },
    imageUrl1:{
        type:String,
        required: true 
    },
    date_added: {
        type: Date,
        default: Date.now
    },
});

module.exports = Item = mongoose.model('item',ItemSchema);