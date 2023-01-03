import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.post("/course/:id/fb", mainService.feedbackService);

router.post("/course/:id/buy", mainService.createRegister);

router.post("/course/:id/fav", mainService.createFavorite);

router.get("/course/:id", mainService.getCourseDetail);

export default router;
