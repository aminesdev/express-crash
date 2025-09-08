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
