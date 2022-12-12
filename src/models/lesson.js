import mongoose from "mongoose";

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

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;