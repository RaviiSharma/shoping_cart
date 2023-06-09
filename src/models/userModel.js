const mongoose = require("mongoose");
const {isValidEmail,isValidPhone} = require("../utilities/validator")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email address already exist"],
        validate: [isValidEmail, "Please enter a valid Email address"],
        trim: true,
    },
    
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: [true, "Phone number already exist"],
        validate: [isValidPhone, "Please enter a valid phone number"],
        trim: true,
    },
    role: { type: String, required: true, trim: true,enum:["Admin","User"] },

}, { timestamps: true });

module.exports = mongoose.model('user', userSchema)