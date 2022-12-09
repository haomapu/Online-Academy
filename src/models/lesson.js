const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    overview: {
        type: String,
    },

    preview: {
        type: Boolean,
        default: false,
    },

    video: {
        type: String,
    },
});

const lesson = mongoose.model("Lesson", lessonSchema);
module.exports = lesson;