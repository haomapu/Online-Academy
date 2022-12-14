import express from "express";
import User from "../controllers/users.service";

const router = express.Router();

router.get("/", function (req, res) {
    res.render("vwRegisterPage/registerPage");
});

<<<<<<< HEAD
// router.post('/register', function(req, res, next) {
//     var salt = crypto.randomBytes(16);
//     crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//       if (err) { return next(err); }
//       const user = {
//         fullname: req.body.name,
//         password: hashedPassword,
//         email: req.body.email,
//         permission: 0
//       }
//       User.createUser(user);
//       req.render("/");
//     });
//   });

=======
>>>>>>> d8a9b5ef9f1dbdd5f5ef460295a1becf87591cbc
export default router;
