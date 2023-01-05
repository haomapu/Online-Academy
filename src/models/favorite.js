import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
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

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;