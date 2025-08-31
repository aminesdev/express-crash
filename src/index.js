import express from "express";

const app = express();
const users = [
    { id: 1, name: "Amine" },
    { id: 2, name: "Zeki" },
    { id: 3, name: "Abdnour" },
];
const products = [
    { id: 1, name: "Product1", price: 120.0 },
    { id: 2, name: "Product2", price: 130.0 },
    { id: 3, name: "Product3", price: 140.0 },
];

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
    res.status(201).send({ msg: "Welcom to my app" });
});

app.get("/api/users", (req, res) => {
    res.send(users);
});

app.get("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });
    const user = users.find((user) => user.id === id);
    if (!user) res.status(404).send({ msg: "User Not Found" });
    res.send(user);
});

app.get("/api/products", (req, res) => {
    res.send(products);
});

app.get("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });
    const product = products.find((product) => product.id === id);
    if (!product) return res.status(404).send({ msg: "Product Not Found" });
    res.send(product);
});

// lcoalhost:3000/products?key=value&key2=value2
