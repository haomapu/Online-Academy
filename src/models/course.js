import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    img: {
        type: String,
    },

    name: {
        type: String,
    },

    overview: {
        type: String,
    }, 

    description: {
        type: String,
    },

    rating: {
        type: Number,
    },

    rating_count: {
        type: Number, 
    },

    register_count: {
        type: Number,
    },

    price: {
        type: Number,
    },

    discount: {
        type: Number,
    },

    lastUpdate: {
        type: String,
    },

    chapters: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Chapter",
    },
    
    author: {
        type: String,
    },
    
    feedbacks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Feedback"
    }
});

const Course = mongoose.model("Course", courseSchema);
export default Course;