import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    img: {
        contentType: {
            type: String,
        },
        image: {
            type: Buffer,
        }
    },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;