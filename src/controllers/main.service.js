import Course from "../models/course.js";

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
    console.log(req.body.email);
  }
};

export default mainService;
