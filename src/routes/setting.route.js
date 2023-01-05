import express from "express";
import settingService from "../controllers/setting.service.js";

const router = express.Router();

router.get("/", settingService.getSettingsPage);

router.get("/courseLecture", settingService.getCoursePage); // 

router.get("/courseStudent", settingService.getCourseStudentPage);

router.get("/favourite", settingService.getFavourite);

router.post("/favourite/remove", settingService.removeFavorite);

router.get("/editProfile", settingService.getEditProfilePage);

router.post("/editProfile/patch", settingService.postEditProfile);

router.get("/dashboard", settingService.getDashboardPage);

export default router;
