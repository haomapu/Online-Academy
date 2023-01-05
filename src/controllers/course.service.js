import Course from "../models/course.js";
import Feedback from "../models/feedback.js";
import Register from "../models/register.js";
import Favorite from "../models/favorite.js";
import User from "../models/user.js";
const courseService = {

getCourseDetail: async (req, res) => {
    console.log(req.params.id);
    const top5 = 5;
    const course = await Course.findOne({ name: req.params.id }).lean();
    const top5cate = await Course.find({
      name: { $not: { $eq: req.params.id } },
    })
      .sort({ register_count: -1 })
      .lean()
      .limit(top5);
    const feedbacks = [];
    const curPage = req.query.page || 1;
    const limit = 4;
    const offset = (curPage - 1) * limit;

    const total = await Feedback.find({course: course._id}).count();
    var nPages;

    total % limit != 0
      ? (nPages = Math.ceil(total / limit))
      : (nPages = total / limit);

    const pageNumbers = [];

    for (let i = 1; i <= nPages; i++) {
      pageNumbers.push({
        value: i,
        isCurrent: i === +curPage,
      });
    }

    const queryFeedback = await Feedback.find({ course: course._id })
      .sort({ time: -1 })
      .skip(offset)
      .limit(limit);

    if (queryFeedback.length != 0) {
      for (let i = 0; i < queryFeedback.length; i++) {
        const content = queryFeedback[i].content;
        var user;
        if (queryFeedback[i].author) {
          user = await User.findById(queryFeedback[i].author._id);
        }
        if (user) {
          feedbacks.push({
            content: content,
            avatar: user.avatar,
            author: user.username,
            star: queryFeedback[i].star,
            time: queryFeedback[i].time.toLocaleString(),
          });
        }
      }
    }
    var curUser;
    var buy;
    if (req.isAuthenticated()) {
      curUser = req.user;
      buy = await Register.find({$and:[ {student: curUser._id}, {course: course._id}]}).lean();
    }
    res.render("vwDetails/details", {
      course: course,
      feedbacks: feedbacks,
      rec: top5cate,
      pageNumbers: pageNumbers,
      buy: buy,
    });
  },

  feedbackService: async (req, res, next) => {
    try {
      var curUser;
      if (req.isAuthenticated()) {
        curUser = req.user;
      } else {
        res.redirect("/login");
        return;
      }
      if (curUser.hasOwnProperty("_json")) {
        req.body = {
          ...req.body,
          author: await User.findOne({
            username: curUser._json.given_name + curUser._json.family_name,
          }),
        };
      } else {
        req.body = { ...req.body, author: await User.findById(curUser._id) };
      }

      const course = await Course.findOne({ name: req.params.id });

      req.body = { ...req.body, course: course };
      const feedback = new Feedback(req.body);
      await feedback.save();

      const queryRating = await Feedback.find({ course: course._id }).lean();
      var sum = 0;
      for (var x of queryRating) {
        sum += x.star;
      }
      const averageStar = sum / queryRating.length;
      await Course.updateOne(
        { _id: course._id },
        { rating: averageStar, rating_count: queryRating.length }
      );

      res.redirect("/course/" + req.params.id);
    } catch (e) {
      res.send(e);
    }
  },
  createRegister: async (req, res, next) => {
    var newRegister = {};
    if (req.isAuthenticated()) {
      var user = req.user;
    } else {
      res.redirect("/login/");
      return;
    }
    const student = await User.findById(user._id);
    const course = await Course.findOne({ name: req.params.id });
    newRegister = { ...newRegister, student: student };
    newRegister = { ...newRegister, course: course };
    const createRegister = new Register(newRegister);
    await createRegister.save();
    await Course.updateOne(
      { _id: course._id },
      { register_count: await Register.find({ course: course._id }).count() }
    );

    res.redirect("/course/" + req.params.id);
  },

  createFavorite: async (req, res) => {
    var newFavorite = {};
    if (req.isAuthenticated()) {
      var user = req.user;
    } else {
      res.redirect("/login");
      return;
    }
    const student = await User.findById(user._id);
    const course = await Course.findOne({ name: req.params.id });
    newFavorite = { ...newFavorite, student: student };
    newFavorite = { ...newFavorite, course: course };
    const createFavorite = new Favorite(newFavorite);
    await createFavorite.save();

    res.redirect("/course/" + req.params.id);
  },

}
export default courseService;
