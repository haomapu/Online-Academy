import Course from "../models/course.js";

const courseService = {
    getAllCourses : async (req,res) => {
        try{
            const courses = await Course.find();
            res.status(200).send(courses);
        }catch (err) {
            res.status(500).json(err);
        }
    },

    createCourse : async(req, res) => {
        try {
            const newCourse = new Course(req.body);
            const savedCourse = await newCourse.save();
            res.status(200).json(savedCourse);
        }catch (err) {
            res.status(500).json(err);
        }
    },

    getCourse : async(req, res) => {
        try {
            const course = await Course.findById(req.params.id);
            res.status(200).json(course);
        }catch (err) {
            res.status(500).json(err);
        }
    },

    deleteCourse : async (req, res) => {
        try {
            const course = await Course.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        }catch(err) {
            res.status(500).json(err);
        }
    }
}

export default courseService;

   