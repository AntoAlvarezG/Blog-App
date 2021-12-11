const router = require("express").Router();
const { userLogin } = require("../controllers/auth");

// login
router.post('/login', userLogin);

module.exports = router;