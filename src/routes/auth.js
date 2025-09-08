import {Router} from "express";
import "../config/passport.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";


const router = Router();

router.use(cookieParser("helloworld"));
router.use(
    session({
        secret: "aminesdev",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost/express_crash",
            collectionName:"sessions"
        })
    })
);

router.use(passport.initialize());
router.use(passport.session());

router.post("/api/auth", passport.authenticate("local"), (req, res) => {
    res.status(200).send();
});

router.get("/api/auth/status", (req, res) => {
    return req.user
        ? res.status(200).send({ msg: "Authenticated", user: req.user })
        : res.sendStatus(401);
});

router.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
    });
});

export default router;
