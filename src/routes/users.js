const router = require("express").Router();
const { authToken } = require("../controllers/auth");
const { 
    newUser, 
    getUsers, 
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/users");

// register
router.post('/register', newUser);

// fetch all users 
router.get('/all', getUsers);

// fetch user by id
router.get('/:id', getUserById);

// update user data
router.put('/:id', authToken, updateUser);

// delete user 
router.delete('/:id', authToken, deleteUser);

module.exports = router;