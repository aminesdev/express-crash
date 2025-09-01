import express, { json } from "express";

const app = express();
app.use(express.json());

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

    if (filter && value)
        return res.send(users.filter((user) => user[filter].includes(value)));
    res.send(users);
});

app.post("/api/users", (req, res) => {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
        return res.status(400).send({ msg: "Missing required fields" });
    }
    const newUser = {
        id: users[users.length - 1].id + 1,
        name,
        email,
        age: parseInt(age),
    };
    users.push(newUser);
    return res.status(201).send({ msg: "User created", user: newUser });
});

app.get("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });
    const user = users.find((user) => user.id === id);
    if (!user) res.status(404).send({ msg: "User Not Found" });
    res.send(user);
});

app.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { body } = req;
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1)
        return res.status(404).send({ msg: "User Not Found" });
    users[userIndex] = { id, ...body };
    res.status(200).send({
        msg: "User updated successfully",
        user: users[userIndex],
    });
});

app.patch("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { body } = req;
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1)
        return res.status(404).send({ msg: "User Not Found" });
    users[userIndex] = { ...users[userIndex], ...body };
    res.status(200).send({
        msg: "User updated successfully",
        user: users[userIndex],
    });
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
