const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

// fetch all users
async function getUsers (req, res) {
    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch {
        err => res.status(500).json(err);
    }
}

// register
async function newUser (req, res) {
    try {
        // hash password
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(req.body.password, salt);
        // create new user object
        const newUser = new User(
            {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            }
        )
        // save to database
        let user = await newUser.save();
        res.status(200).json(user);
    } catch {
        err => res.status(500).json(err);
    }
}

// fetch user by id
async function getUserById (req, res) {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch {
        err => res.status(500).json(err);
    }
}

// update user data
async function updateUser (req, res) {
    if (req.user._id === req.params.id) {
        // if password changes
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        // update info
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { 
                    $set: req.body
                },
                { new: true }
            )
            res.status(200).json(updatedUser);
        } catch {
            err => res.status(500).json(err);
        }
    } else {
        res.sendStatus(401);
    }
}

// delete user
async function deleteUser (req, res) {
    if (req.user._id === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json('User deleted.');
            } catch {
                err => res.status(500).json(err);
            }
        } catch{
            err => res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    newUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}
