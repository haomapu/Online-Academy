import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    sub_categories: [
        {
            type: mongoose.Schema.Types.Object,
            ref: "SubCategory",
        },
    ],
});

const Category = mongoose.model("Category", categorySchema);
export default Category;