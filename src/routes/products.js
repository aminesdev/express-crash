import { Router } from "express";
import { products } from "../utils/constants.js";
import {
    createProductValidation,
    updateProductValidation,
    validate,
} from "../utils/validationSchemas.js";

const router = Router();

router.get("/api/products", (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    if (req.cookies.hello && req.cookies.hello === "world") {
        return res.send(products);
    }
    res.status(403).send({ msg: "Sorry. You need the correct cookie" });
});

router.get("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });

    const product = products.find((p) => p.id === id);
    if (!product) return res.status(404).send({ msg: "Product Not Found" });

    res.send(product);
});

router.post("/api/products", createProductValidation, validate, (req, res) => {
    const { name, price, category } = req.body;

    const newProduct = {
        id: products[products.length - 1].id + 1,
        name,
        price: parseFloat(price),
        category,
    };

    products.push(newProduct);
    res.status(201).send({ msg: "Product created", product: newProduct });
});

router.put(
    "/api/products/:id",
    updateProductValidation,
    validate,
    (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).send({ msg: "Bad Request. Invalid ID." });

        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex === -1)
            return res.status(404).send({ msg: "Product Not Found" });

        const { name, price, category } = req.body;

        products[productIndex] = {
            id,
            name,
            price: parseFloat(price),
            category,
        };

        res.send({ msg: "Product updated", product: products[productIndex] });
    }
);

router.patch(
    "/api/products/:id",
    updateProductValidation,
    validate,
    (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).send({ msg: "Bad Request. Invalid ID." });

        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex === -1)
            return res.status(404).send({ msg: "Product Not Found" });

        products[productIndex] = { ...products[productIndex], ...req.body };

        res.send({ msg: "Product updated", product: products[productIndex] });
    }
);

router.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });

    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1)
        return res.status(404).send({ msg: "Product Not Found" });

    const deleted = products.splice(productIndex, 1);
    res.send({ msg: `Product with ID:${deleted[0].id} deleted successfully` });
});

export default router;
