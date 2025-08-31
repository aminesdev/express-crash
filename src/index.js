import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
    res.status(201).send({ msg: "Hello, Wolrd" });
});

app.get("/api/users", (req, res) => {
    res.send([
        { id: 1, name: "Amine" },
        { id: 2, name: "Zeki" },
        { id: 3, name: "Abdnour" },
    ]);
});

app.get("/api/products", (req, res) => {
    res.send([
        { id: 1, name: "Product1", price: 120.0 },
        { id: 2, name: "Product2", price: 130.0 },
        { id: 3, name: "Product3", price: 140.0 },
    ]);
})
