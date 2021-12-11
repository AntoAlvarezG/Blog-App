const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// login
async function userLogin (req, res) {
    try {
        // fetch user from database
        let user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json('Wrong credentials');
        // compare passwords
        const validatedPass = await bcrypt.compare(req.body.password, user.password);
        if (!validatedPass) return res.status(400).json('Wrong credentials');
        // if credentials ok return a jwt
        const { password, ...others } = user._doc;
        const accessToken = jwt.sign(others, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ accessToken });
    } catch {
        (err) => res.status(500).json(err);
    }
}

async function authToken (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    // verify given token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}


module.exports = { userLogin, authToken }