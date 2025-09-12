import passport from "passport";
import { Strategy } from "passport-discord";
import { User } from "../models/User.js";

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
        {
            clientID: "1414749501138145290",
            clientSecret: "6q8c303Xi6ywJsp2WpJ9R7mbzvJ7yzcy",
            callbackURL: "http://localhost:3000/api/auth/discord/redirect",
            scope: ["identify"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let findUser = await User.findOne({ discordId: profile.id });
                if (findUser) {
                    return done(null, findUser);
                }
                const newUser = new User({
                    name: profile.username || profile.global_name,
                    email: profile.email,
                    age: 18,
                    password: "discord_auth",
                    discordId: profile.id,
                    avatar: profile.avatar,
                });
                const savedUser = await newUser.save();
                return done(null, savedUser);
            } catch (error) {
                console.error("Discord Strategy Error:", error);
                return done(error, null);
            }
        }
    )
);
