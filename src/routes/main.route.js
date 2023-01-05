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

router.get("/postCourse", mainService.createCoursePage);



export default router;
