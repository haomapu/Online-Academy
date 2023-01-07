import express from "express";
import courseService from "../controllers/course.service.js";

const router = express.Router();

router.get("/:id", courseService.getCourseDetail);

router.get("/test/course", courseService.viewCourse);

router.post("/:id/fb", courseService.feedbackService);

router.post("/:id/buy", courseService.createRegister);

router.post("/:id/fav", courseService.createFavorite);


export default router;
