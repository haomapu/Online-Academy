import Course from "../models/course.js";
import Feedback from "../models/feedback.js";
import User from "../models/user.js"
const mainService = {
  getHomePage: async (req, res) => {
    res.render("home");
  },

  getSearchPage: async (req, res) => {
    res.render("vwSearchPage/searchPage");
  },

  getCourseDetail: async (req, res) => {
    const query = Course.where({ id: req.params.id });
    const course = await query.findOne().lean();
    
    const feedbacks = [];


    for (let i = 0; i < course.feedbacks.length; i++){
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
      feedbacks: feedbacks
    });
  },

  getSettingsPage: async (req, res) => {
    res.render("vwSettingsPage/settingsPage");
  },

  getEditProfilePage: async (req, res) => {
    res.render("vwSettingsPage/settingsPageEdit");
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
    console.log(req.body.email);
  }
};

export default mainService;
