import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.get('/', mainService.getHomePage);

router.get('/search', mainService.getSearchPage);

router.get('/courses/:id', mainService.getCourseDetail);

export default router;