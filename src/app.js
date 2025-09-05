import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { users } from "./utils/constants.js";

const app = express();
app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
    session({
        secret: "aminesdev",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
    req.session.visited = true;

    console.log(req.session);
    console.log(req.session.id);

    res.cookie("hello", "world", { maxAge: 1000 * 60, signed: true });
    res.status(200).send({ msg: "Welcome to my app" });
});

app.post("/api/auth", (req, res) => {
    const {
        body: { name, password },
    } = req;
    const findeUser = users.find((user) => user.name === name);
    if (!findeUser || findeUser.password !== password)
        return res.status(404).send({ msg: "Bad credentials" });
    req.session.user = findeUser;
    return res.status(200).send(findeUser);
});

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session)
    })
    return req.session.user
        ? res.status(200).send(req.session.user)
        : res.status(401).send({ msg: "Not Authenticated" });
});
