import Course from "../models/course.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";

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
    res.render("vwDetails/details", {
      course,
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
    try {
      const { username, email, password} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.findOne({email: email}).lean();

      if(user) {
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
        })
        await savedUser.save();
        res.render("home");
      }
    }catch(e) {
      res.send(e);
    }
  }
};

export default mainService;
