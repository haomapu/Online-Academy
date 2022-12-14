import Course from "../models/course.js";
import Feedback from "../models/feedback.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const mainService = {
  getHomePage: async (req, res) => {
    res.render("home");
  },

  getSearchPage: async (req, res) => {
    res.render("vwSearchPage/searchPage");
  },

  getCourseDetail: async (req, res) => {
    const top5 = 5;

    const query = Course.where({ id: req.params.id });
    const course = await query.findOne().lean();
    const top5cate = await Course.find()
      .sort({ register_count: -1 })
      .lean()
      .limit(top5);

    const feedbacks = [];
    for (let i = 0; i < course.feedbacks.length; i++) {
      const feedback = await Feedback.findById(course.feedbacks[i]._id);
      const user = await User.findById(feedback.author._id);

      feedbacks.push({
        content: feedback.content,
        avatar: user.avatar,
        author: user.username,
        time: feedback.time,
      });
    }

    res.render("vwDetails/details", {
      course: course,
      feedbacks: feedbacks,
      rec: top5cate,
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
    res.render("vwLoginPage/loginPage");
  },

  getSignupPage: async (req, res) => {
    res.render("vwRegisterPage/registerPage");
  },

  loginService: async (req, res) => {
    console.log(req.body);
  },

  signupService: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.findOne({ email: email }).lean();

      if (user) {
        res.render("vwRegisterPage/registerPage");
        console.log("Existed email");
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
        res.render("home");
      }
    } catch (e) {
      res.send(e);
    }
  },
};

export default mainService;
