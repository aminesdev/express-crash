import { Router } from "express";
import { users } from "../utils/constants.js";
import {
    createUserValidation,
    updateUserValidation,
    validate,
} from "../utils/validationSchemas.js";
const resolveIndexByUserId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).send({ msg: "Bad Request. Invalid ID." });

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1)
        return res.status(404).send({ msg: "User Not Found" });

    req.findUserIndex = userIndex;
    next();
};

const router = Router();

router.get("/api/users", (req, res) => {
    console.log(`session: ${req.session}`);
    console.log(`sessionID: ${req.session.id}`);
    console.log(
        `session: ${req.sessionStore.get(req.session.id, (err, sessionData) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(sessionData);
        })}`
    );
    const {
        query: { filter, value },
    } = req;
    if (filter && value)
        return res.send(
            users.filter((user) => user[filter]?.toString().includes(value))
        );
    res.send(users);
});

router.post("/api/users", createUserValidation, validate, (req, res) => {
    const { name, email, age } = req.body;
    const newUser = {
        id: users[users.length - 1].id + 1,
        name,
        email,
        age: parseInt(age),
    };
    users.push(newUser);
    return res.status(201).send({ msg: "User created", user: newUser });
});

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    res.send(users[req.findUserIndex]);
});

router.put(
    "/api/users/:id",
    updateUserValidation,
    validate,
    resolveIndexByUserId,
    (req, res) => {
        const { body } = req;
        users[req.findUserIndex] = { id: users[req.findUserIndex].id, ...body };
        res.status(200).send({
            msg: "User updated successfully",
            user: users[req.findUserIndex],
        });
    }
);

router.patch(
    "/api/users/:id",
    resolveIndexByUserId,
    updateUserValidation,
    validate,
    (req, res) => {
        const { body } = req;
        users[req.findUserIndex] = { ...users[req.findUserIndex], ...body };
        res.status(200).send({
            msg: "User updated successfully",
            user: users[req.findUserIndex],
        });
    }
);

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const deleted = users.splice(req.findUserIndex, 1);
    res.status(200).send({
        msg: `User with ID:${deleted[0].id} deleted successfully`,
    });
});

export default router;
