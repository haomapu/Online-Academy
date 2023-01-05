import express from "express";
import courseService from "../controllers/course.service.js";

const router = express.Router();

router.post("/:id/fb", courseService.feedbackService);

router.post("/:id/buy", courseService.createRegister);

router.post("/:id/fav", courseService.createFavorite);

router.get("/:id", courseService.getCourseDetail);



export default router;
