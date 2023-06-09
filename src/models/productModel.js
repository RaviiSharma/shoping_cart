const mongoose = require("mongoose");
const {isValidPrice} = require("../utilities/validator")


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        unique: [true, "title is unique"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "product price is required"],
        validate: [isValidPrice, "enter a valid price"],
        min:1, //minimum 1 rupees
    },
    type: {
        type: String
    },
    deletedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);