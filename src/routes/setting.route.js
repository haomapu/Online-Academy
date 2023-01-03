import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.get("/", mainService.getSettingsPage);

router.get("/courseLecture", mainService.getCoursePage);

router.get("/editProfile", mainService.getEditProfilePage);

router.post("/editProfile/patch", mainService.postEditProfile);

router.get("/dashboard", mainService.getDashboardPage);


export default router;
