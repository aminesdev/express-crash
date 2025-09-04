import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
    res.cookie("hello", "world", { maxAge: 1000 * 60, signed: true });
    res.status(200).send({ msg: "Welcome to my app" });
});
