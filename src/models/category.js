import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    description: {
        type: String, 
    },

    sub_categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
        },
    ],
});

const Category = mongoose.model("Catergory", categorySchema);
export default Category;