import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },

    password: { 
        type: String,
        required: true,
    },

    fullname: {
        type: String,
    },

    email: {
        type: String,
        unique: true,
    },

    role: {
        type: Number,
        default: 2,
    },
    
    avatar: {
        type: String,
    },

    otp: {
        type: String,
    },
});

const User = mongoose.model("User", userSchema);
export default User;