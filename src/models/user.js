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
        default: 1,
    },
    
    avatar: {
        type: String,
    },

    otp: {
        type: String,
    },

    otp_count: {
        type: Number,
        default: 0,
    },
    
    verified: {
        type: Boolean,
        default: false,
    }
});

const User = mongoose.model("User", userSchema);
export default User;