import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    main_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },

});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
