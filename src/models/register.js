import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },

    date: {
        type: Date,
        default: Date.now,
    },

});

const Register = mongoose.model("Register", registerSchema);
export default Register;