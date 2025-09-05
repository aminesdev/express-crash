import { Router } from "express";
import userRouter from "./users.js";
import productRouter from "./products.js";
import authRouter from "./auth.js"

const router = Router();

router.use(authRouter)
router.use(userRouter);
router.use(productRouter);

const logginMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};

router.use(logginMiddleware);

export default router;