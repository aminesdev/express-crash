import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 64,
    },
    price: {
        type: Number,
        required: true,
        min: 0.01,
    },
    category: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 64,
    },
}, {timestamps: true});

export const Product = mongoose.model("Product", ProductSchema);