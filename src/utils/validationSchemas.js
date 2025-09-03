import { body } from "express-validator";
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
