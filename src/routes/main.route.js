import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.get("/", mainService.getHomePage);

router.get("/search", mainService.getSearchCourses);

router.get("/login", mainService.getLoginPage);

router.post("/login", mainService.loginService);

router.get("/otp", mainService.getOtpPage);

router.post("/otp", mainService.otpService);

router.get("/signup", mainService.getSignupPage);

router.post("/signup", mainService.signupService);

router.get("/logout", mainService.logoutService);

router.get("/postCourse", mainService.createCoursePage);


export default router;
