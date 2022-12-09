const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },

    lessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
        },
    ],
});

const Chapter = mongoose.model("Chapter", chapterSchema);
module.exports = Chapter;