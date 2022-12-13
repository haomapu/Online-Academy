import Course from "../models/course.js";

const mainService = {
    getHomePage : async(req, res) => {
        res.render("home");
    },

    getSearchPage: async(req, res) => {
        res.render("vwSearchPage/searchPage");
    },
    
    getCourseDetail: async(req, res) => {
        const course = await Course.findOne({'name': req.params.id}).lean();
        res.render('vwDetails/details', {
            course
        });
    },

    getLoginPage: async(req, res) => {
        res.render("vwLoginPage/loginPage")
    },
};

export default mainService;