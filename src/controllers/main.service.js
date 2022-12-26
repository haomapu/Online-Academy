import Course from "../models/course.js";
import Feedback from "../models/feedback.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";
import authenticationMiddleware from "../middlewares/authentication.js";

const mainService = {
  getHomePage: async (req, res) => {
    const course = await Course.find().sort({lastUpdate : 1}).lean().limit(4);
    res.render("home",{
      newCourse: course
    });

  },

  getSearchPage: async (req, res) => {
    if(req.isAuthenticated()) {
      console.log(req.user.username);
    }
    res.render("vwSearchPage/searchPage");
  },

  getCourseDetail: async (req, res) => {
    const top5 = 5;
    const course = await Course.findOne({ name: req.params.id }).lean();
    const top5cate = await Course.find({ name: { $not: { $eq: req.params.id } } }).sort({ register_count: -1 }).lean().limit(top5);
    const feedbacks = [];

    const curPage = req.query.page || 1;
    const limit = 4;
    const offset = (curPage - 1) * limit;
    const total = await Feedback.find().count(); 
    const nPages = Math.ceil(total / limit);
    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: i === +curPage
      });
    }
    const queryFeedback = await Feedback.find({ course: course._id }).sort({time: -1}).skip(offset).limit(limit);

    if (queryFeedback.length != 0) {
      for (let i = 0; i < queryFeedback.length; i++) {
        const content = queryFeedback[i].content

        const user = await User.findById(queryFeedback[i].author._id);

        feedbacks.push({
          content: content,
          avatar: user.avatar,
          author: user.username,
          time: queryFeedback[i].time.toLocaleString(),
        });
      }
    }
    var user = "";
    if(req.isAuthenticated()) {
      user = req.user
    }

    res.render("vwDetails/details", {
      course: course,
      feedbacks: feedbacks,
      rec: top5cate,
      pageNumbers: pageNumbers,
      user: user
    });
  },

  getSettingsPage: async (req, res) => {
    res.render("vwSettingsPage/settingsPage");
  },

  getEditProfilePage: async (req, res) => {
    res.render("vwSettingsPage/settingsPageEdit");
  },
  getDashboardPage: async (req, res) => {
    res.render("vwSettingsPage/dashboardPage");
  },

  getLoginPage: async (req, res) => {
    if(req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("vwLoginPage/loginPage");
    }
  },

  getSignupPage: async (req, res) => {
    res.render("vwRegisterPage/registerPage");
  },

  logoutService: async (req, res) => {
    req.logout();
    res.redirect("/login");
  },

  loginService:
    passport.authenticate('local', {
      failureRedirect: "/login",
      successRedirect: "/",
      failureFlash: true,
      failureFlash: "Tài khoản hoặc mật khẩu không chính xác",
  
  },),

  signupService: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.findOne({ email: email }).lean();

      if (user) {
        return res.redirect("/signup");
      } else {
        const savedUser = new User({
          username: username,
          email: email,
          password: hashedPassword,
          otp: "",
          avatar: "",
          phone: "",
          fullname: "",
        });
        await savedUser.save();
      }
    } catch (e) {
      res.send(e);
      return res.redirect("/signup");
    }
    return res.redirect("/login");
  },

  // lan sau de cai nay o student.service.js de day do
  feedbackService: async (req, res, next) => {
    try {
      var user = "";
      if(req.isAuthenticated()) {
        user = req.user
      }     
      req.body = { ...req.body, author: await User.findById(user._id) };
      req.body = { ...req.body, course: await Course.findOne({ name: req.params.id }) };
      const feedback = new Feedback(req.body);
      const savedFeedback = await feedback.save();
      res.redirect('/course/' + req.params.id);
    } catch (e) {
      res.send(e);
    }

  },

  createCoursePage: async (req, res) => {
    res.render('vwLecturer/createCourse')
  }
};

export default mainService;
