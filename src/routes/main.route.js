import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.get("/", mainService.getHomePage);

router.get("/search", mainService.getSearchPage);

router.get("/login", mainService.getLoginPage);

router.post("/login", mainService.loginService);

router.get("/signup", mainService.getSignupPage);

router.post("/signup", mainService.signupService);

router.get("/course/:id", mainService.getCourseDetail);

router.get("/settings", mainService.getSettingsPage);

router.get("/settings/editProfile", mainService.getEditProfilePage);

router.get("/settings/dashboard", mainService.getDashboardPage);

export default router;
