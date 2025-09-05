import passport from "passport";
import Strategy from "passport-local";
import { users } from "../utils/constants.js";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try {
        const findUser = users.find((user) => user.id === id);
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy(
        { usernameField: "email", passwordField: "password" },
        (email, password, done) => {
            console.log(`email: ${email} \npassword: ${password}`);
            try {
                const findUser = users.find((user) => user.email === email);
                if (!findUser) throw new Error("User not found");
                if (findUser.password !== password)
                    throw new Error("Invalid Credentials");
                done(null, findUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
