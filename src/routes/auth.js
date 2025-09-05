import { Router } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

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

export default router;
