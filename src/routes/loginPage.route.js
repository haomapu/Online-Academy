import userService from "../controllers/users.service.js";
import express from "express";

const router = express.Router();

router.get('/getAll', userService.getAllUsers);

router.get('/:id', userService.getUser);

router.post('/', userService.createUser);

router.delete('/:id', userService.deleteUser);

export default router;