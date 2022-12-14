import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.get("/", mainService.getHomePage);

router.get("/search", mainService.getSearchPage);

router.get("/login", mainService.getLoginPage);

router.get("/signup", mainService.getSignupPage);

router.get("/course/:id", mainService.getCourseDetail);

router.get("/settings", mainService.getSettingsPage);

router.get("/settings/editProfile", mainService.getEditProfilePage);

export default router;
