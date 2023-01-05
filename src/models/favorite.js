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
    
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;