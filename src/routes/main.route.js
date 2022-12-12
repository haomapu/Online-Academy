import express from "express";
import mainService from "../controllers/main.service.js";

const router = express.Router();

router.get('/', mainService.getHomePage);

router.get('/search', mainService.getSearchPage);

export default router;