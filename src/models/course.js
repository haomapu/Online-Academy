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
    default: 5,
  },

  rating_count: {
    type: Number,
    default: 0,
  },

  register_count: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
  },

  discount: {
    type: Number,
    default: 0,
  },

  lastUpdate: {
    type: Date,
    default: Date.now(),
  },
  totalView: {
    type: Number,
    default: 0,
  },
  chapters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Chapter",
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },

  sub_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  enable: {
    type: Boolean,
    default: true,
  },

  finish: {
    type: Boolean,
    default: false,
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
