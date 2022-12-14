import express from "express";
import User from "../controllers/users.service";

const router = express.Router();

router.get("/", function (req, res) {
    res.render("vwRegisterPage/registerPage");
});

export default router;
