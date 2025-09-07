import { Router } from "express";
import { Product } from "../models/Product.js";
import {
    createProductValidation,
    updateProductValidation,
    validate,
} from "../utils/validationSchemas.js";

const router = Router();

router.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ msg: "Product Not Found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post(
    "/api/products",
    createProductValidation,
    validate,
    async (req, res) => {
        try {
            const { name, price, category } = req.body;
            const newProduct = new Product({ name, price, category });
            const savedProduct = await newProduct.save();
            res.status(201).json({
                msg: "Product created",
                product: savedProduct,
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.put(
    "/api/products/:id",
    updateProductValidation,
    validate,
    async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            );
            if (!updatedProduct)
                return res.status(404).json({ msg: "Product Not Found" });
            res.status(200).json({
                msg: "Product updated",
                product: updatedProduct,
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct)
            return res.status(404).json({ msg: "Product Not Found" });
        res.status(200).json({
            msg: `Product with ID ${id} deleted successfully`,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
