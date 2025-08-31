import express from "express";

const app = express();

const users = [
    { id: 1, name: "Amine", email: "amine@example.com", age: 20 },
    { id: 2, name: "Zeki", email: "zeki@example.com", age: 22 },
    { id: 3, name: "Abdnour", email: "abdnour@example.com", age: 21 },
    { id: 4, name: "Ahmed", email: "ahmed@example.com", age: 20 },
    { id: 5, name: "Khaled", email: "khaled@example.com", age: 25 },
];

const products = [
    { id: 1, name: "Laptop", price: 1200.0, category: "Electronics" },
    { id: 2, name: "Headphones", price: 150.0, category: "Electronics" },
    { id: 3, name: "Coffee Mug", price: 20.0, category: "Kitchen" },
    { id: 4, name: "Backpack", price: 60.0, category: "Accessories" },
    { id: 5, name: "Smartphone", price: 900.0, category: "Electronics" },
];

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
    res.status(201).send({ msg: "Welcom to my app" });
});

app.get("/api/users", (req, res) => {
    const {
        query: { filter, value },
    } = req;
    // filter and value undefined
    if (!filter || !value) return res.send(users);
    if (filter && value)
        return res.send(users.filter((user) => user[filter].includes(value)));
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
