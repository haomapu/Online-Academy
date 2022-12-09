const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
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
module.exports = Feedback;