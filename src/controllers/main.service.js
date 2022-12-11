import detailService from "./details.service.js";

const mainService = {
    getHomePage : async(req, res) => {
        res.render("home");
    },

    getSearchPage: async(req, res) => {
        res.render("vwSearchPage/searchPage");
    },
    
    getCourseDetail: async(req, res) => {
        const id = req.params.id;
        const list = await detailService.findAll();
        res.render('vwDetails/details', {
            detail: list[id],
            empty: list.length === 0
        });
    },
};

export default mainService;