import mongoose from "mongoose";

const processSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
    },

    completed: {
        type: Boolean,
        default: false,
    },
    
});

const Process = mongoose.model("Process", processSchema);
export default Process;