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
    
    const course = await Course.findOne({name: req.params.id}).lean();
    const top5cate = await Course.find({name: { $not: { $eq: req.params.id} }}).sort({register_count: -1}).lean().limit(top5);
    const queryFeedback = await Feedback.find({course: course._id});
    const feedbacks = [];
    if (queryFeedback.length != 0){
      for (let i = 0; i < queryFeedback.length; i++){
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
  
  feedbackService: async(req, res, next) => {
    try {
      req.body = {...req.body, author: await User.findById("639978639e7caee6a44a7b3f")};
      req.body = {...req.body, course: await Course.findOne({name: req.params.id})};
      const feedback = new Feedback(req.body);
      const savedFeedback = await feedback.save();
      res.redirect('/course/' + req.params.id);
    }catch(e){
      res.send(e);
    }
    
  }
};

export default mainService;
