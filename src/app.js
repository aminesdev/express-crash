import express from "express";
import routes from "./routes/index.js";
import mongoose from "mongoose";

const app = express();
mongoose
    .connect("mongodb://localhost/express_crash")
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});
