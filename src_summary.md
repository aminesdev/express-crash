# Project: src

## File: app.js
```js
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


```

## File: config/discord-strategy.js
```js
import passport from "passport";
import { Strategy } from "passport-discord";

export default passport.use(
    new Strategy({
        clientID: "1414749501138145290",
        clientSecret: "6q8c303Xi6ywJsp2WpJ9R7mbzvJ7yzcy",
        callBackURL: "http://localhost:3000/api/auth/discord/redirect",
        scope: ["identify", "guilds"],
    }),
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);

    }
);
```

## File: config/local-strategy.js
```js
import passport from "passport";
import Strategy from "passport-local";
import { User } from "../models/User.js";
import { comparePassword } from "../utils/helpers.js";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id);
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const findUser = await User.findOne({ email });
                if (!findUser) throw new Error("User Not Found");
                if (!comparePassword(password, findUser.password))
                    throw new Error("Bad Credentials");
                done(null, findUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

```

## File: models/Product.js
```js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 64,
    },
    price: {
        type: Number,
        required: true,
        min: 0.01,
    },
    category: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 64,
    },
}, {timestamps: true});

export const Product = mongoose.model("Product", ProductSchema);
```

## File: models/User.js
```js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export const User = mongoose.model("User", UserSchema);

```

## File: routes/auth.js
```js
import {Router} from "express";
// import "../config/local-strategy.js";
import "../config/discord-strategy.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";


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

router.get("/api/auth/discord",passport.authenticate("discord"))

export default router;

```

## File: routes/index.js
```js
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
```

## File: routes/products.js
```js
import { Router } from "express";
import { Product } from "../models/Product.js";
import {
    createProductValidation,
    updateProductValidation,
    validate,
} from "../utils/validationSchemas.js";

const router = Router();

router.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ msg: "Product Not Found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post(
    "/api/products",
    createProductValidation,
    validate,
    async (req, res) => {
        try {
            const { name, price, category } = req.body;
            const newProduct = new Product({ name, price, category });
            const savedProduct = await newProduct.save();
            res.status(201).json({
                msg: "Product created",
                product: savedProduct,
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.put(
    "/api/products/:id",
    updateProductValidation,
    validate,
    async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                updates,
                { new: true, runValidators: true }
            );
            if (!updatedProduct)
                return res.status(404).json({ msg: "Product Not Found" });
            res.status(200).json({
                msg: "Product updated",
                product: updatedProduct,
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
);

router.delete("/api/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct)
            return res.status(404).json({ msg: "Product Not Found" });
        res.status(200).json({
            msg: `Product with ID ${id} deleted successfully`,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

```

## File: routes/users.js
```js
import { Router } from "express";
import { User } from "../models/User.js";
import {
    createUserValidation,
    updateUserValidation,
    validate,
} from "../utils/validationSchemas.js";
import { hashPassword } from "../utils/helpers.js";

const router = Router();

router.get("/api/users", async (req, res) => {
    const { filter, value } = req.query;
    try {
        let users;
        if (filter && value) {
            users = await User.find({
                [filter]: { $regex: value, $options: "i" },
            });
        } else {
            users = await User.find();
        }
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/api/users", createUserValidation, validate, async (req, res) => {
    const { name, email, age, password } = req.body;
    const hashedPassword = await hashPassword(password);
    try {
        const newUser = new User({
            name,
            email,
            age,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        res.status(201).send({ msg: "User created", user: savedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ msg: "User Not Found" });
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put(
    "/api/users/:id",
    updateUserValidation,
    validate,
    async (req, res) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedUser)
                return res.status(404).json({ msg: "User Not Found" });
            res.status(200).json({
                msg: "User updated successfully",
                user: updatedUser,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.delete("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser)
            return res.status(404).json({ msg: "User Not Found" });

        res.status(200).send({
            msg: `User with ID:${deletedUser._id} deleted successfully`,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;

```

## File: utils/helpers.js
```js
import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
};

```

## File: utils/validationSchemas.js
```js
import { body, validationResult } from "express-validator";

export const createUserValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 3, max: 32 })
        .withMessage("Name length must be between 3 and 32 chars"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    body("age")
        .notEmpty()
        .withMessage("Age is required")
        .isInt({ min: 18, max: 100 })
        .withMessage("Age must be between 18 and 100"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 100 })
        .withMessage("Password must be between 6 and 100 characters"),
];

export const updateUserValidation = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 3, max: 32 })
        .withMessage("Name length must be between 3 and 32 chars"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("age")
        .optional()
        .isInt({ min: 18, max: 100 })
        .withMessage("Age must be between 18 and 100"),
];

export const createProductValidation = [
    body("name")
        .notEmpty()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name must be a string")
        .isLength({ min: 2, max: 64 })
        .withMessage("Product name length must be between 2 and 64 chars"),
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0.01 })
        .withMessage("Price must be a positive number"),
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isString()
        .withMessage("Category must be a string")
        .isLength({ min: 3, max: 32 })
        .withMessage("Category length must be between 3 and 32 chars"),
];

export const updateProductValidation = [
    body("name")
        .optional()
        .isString()
        .withMessage("Product name must be a string")
        .isLength({ min: 2, max: 64 })
        .withMessage("Product name length must be between 2 and 64 chars"),
    body("price")
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage("Price must be a positive number"),
    body("category")
        .optional()
        .isString()
        .withMessage("Category must be a string")
        .isLength({ min: 3, max: 32 })
        .withMessage("Category length must be between 3 and 32 chars"),
];

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

```

