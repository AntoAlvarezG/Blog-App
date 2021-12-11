const router = require("express").Router();
const { authToken } = require("../controllers/auth");
const { 
    newPost, 
    getPosts, 
    getPostById,
    updatePost,
    deletePost
} = require("../controllers/posts");

// create new post
router.post('/add', authToken, newPost);

// fetch all posts 
router.get('/all', getPosts);

// fetch post by id
router.get('/:id', getPostById);

// update post
router.put('/:id', authToken, updatePost);

// delete post 
router.delete('/:id', authToken, deletePost);

module.exports = router;