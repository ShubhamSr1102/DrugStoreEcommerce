const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password'],
        minlength: [6, 'Minimum password length must be 6 characters']
    },
    gender: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: [true, 'Please enter your contact information'],
        match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, 'Enter a valid phone number']
    },
    credit_card: {
        type: Number,
        required: [false, 'Please enter your card details']
    },
    imageUrl1:{
        type: String,
        required: false 
    },
    register_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user',UserSchema);