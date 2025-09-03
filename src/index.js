import express from "express";
import {query, validationResult, body} from "express-validator";
import {createUserValidation,updateUserValidation} from "./utils/validationSchemas.js"

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

const logginMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

app.use(logginMiddleware);

const resolveIndexByUserId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1)
        return res.status(404).send({ msg: "User Not Found" });

    req.findUserIndex = userIndex;
    next();
};

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
    res.status(200).send({ msg: "Welcome to my app" });
});

app.get("/api/users", (req, res) => {
    const {
        query: { filter, value },
    } = req;
    if (filter && value)
        return res.send(
            users.filter((user) => user[filter]?.toString().includes(value))
        );
    res.send(users);
});

app.post("/api/users", createUserValidation, validate, (req, res) => {
    const { name, email, age } = req.body;
    const newUser = {
        id: users[users.length - 1].id + 1,
        name,
        email,
        age: parseInt(age),
    };
    users.push(newUser);
    return res.status(201).send({ msg: "User created", user: newUser });
});

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    res.send(users[req.findUserIndex]);
});

app.put(
    "/api/users/:id",
    updateUserValidation,
    validate,
    resolveIndexByUserId,
    (req, res) => {
        const { body } = req;
        users[req.findUserIndex] = { id: users[req.findUserIndex].id, ...body };
        res.status(200).send({
            msg: "User updated successfully",
            user: users[req.findUserIndex],
        });
    }
);

app.patch("/api/users/:id", resolveIndexByUserId,updateUserValidation,validate, (req, res) => {
    const { body } = req;
    users[req.findUserIndex] = { ...users[req.findUserIndex], ...body };
    res.status(200).send({
        msg: "User updated successfully",
        user: users[req.findUserIndex],
    });
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const deleted = users.splice(req.findUserIndex, 1);
    res.status(200).send({
        msg: `User with ID:${deleted[0].id} deleted successfully`,
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
