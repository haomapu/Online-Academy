import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },

    star: {
        type: Number,
        require: true,
        min: 1,
        max: 5,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },

    time: {
        type: Date,
        default: Date.now,
    },

});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
