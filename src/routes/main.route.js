import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.get("/", mainService.getHomePage);

router.get("/search", mainService.getSearchCourses);

router.get("/login", mainService.getLoginPage);

router.post("/login", mainService.loginService, 
function(req, res) {
    console.log(req.session);
    var redirectTo = '/';
    console.log("here");
    console.log(req.session.reqUrl);
    if (req.session.reqUrl) {
        redirectTo = req.session.reqUrl;
        req.session.reqUrl = null;
    };
    res.redirect(redirectTo);
});

//router.post("/login", mainService.loginService);

router.get("/otp", mainService.getOtpPage);

router.post("/otp", mainService.otpService);

router.get("/signup", mainService.getSignupPage);

router.post("/signup", mainService.signupService);

router.get("/logout", mainService.logoutService);

router.post("/course/:id/fb", mainService.feedbackService);

router.post("/course/:id/buy", mainService.createRegister);

router.post("/course/:id/fav", mainService.createFavorite);

router.get("/course/:id", mainService.getCourseDetail);

router.get("/postCourse", mainService.createCoursePage);

router.get("/settings", mainService.getSettingsPage);

router.get("/settings/courseLecture", mainService.getCoursePage);

router.get("/settings/courseStudent", mainService.getCourseStudentPage);

router.get("/settings/favourite", mainService.getFavourite);

router.get("/settings/editProfile", mainService.getEditProfilePage);

router.post("/settings/editProfile/patch", mainService.postEditProfile);

router.get("/settings/dashboard", mainService.getDashboardPage);

export default router;
