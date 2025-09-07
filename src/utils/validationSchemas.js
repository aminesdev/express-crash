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
