import courseService from "../controllers/course.service.js";
import express from "express";

const router = express.Router();

router.get('/', courseService.getAllCourses);

router.get('/:id', courseService.getCourse);

router.post('/', courseService.createCourse);

router.delete('/:id', courseService.deleteCourse);

export default router;