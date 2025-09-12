import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        sparse: true, 
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    discordId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: String,
});


export const User = mongoose.model("User", UserSchema);
