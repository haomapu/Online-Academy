import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    overview: {
        type: String,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    },
});

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;