const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },

});

const Register = mongoose.model("Register", registerSchema);
module.exports = Register;