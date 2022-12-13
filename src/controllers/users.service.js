import User from "../models/user.js";

const userService = {
    getAllUsers : async (req,res) => {
        try{
            const users = await User.find();
            res.status(200).send(users);
        }catch (err) {
            res.status(500).json(err);
        }
    },

    createUser : async(req, res) => {
        try {
            const newUser = new User(req.body);
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);
        }catch (err) {
            res.status(500).json(err);
        }
    },

    getUser : async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        }catch (err) {
            res.status(500).json(err);
        }
    },

    deleteUser : async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete Successfully");
        }catch(err) {
            res.status(500).json(err);
        }
    }
}

export default userService;