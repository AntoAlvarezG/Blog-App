const Post = require("../models/Post");

// fetch all posts
async function getPosts (req, res) {
    const username = req.query.user;
    const category = req.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (category) {
            posts = await Post.find({
                categories: { $in: [category] }
            });
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch {
        err => res.status(500).json(err);
    }
}

// create new post
async function newPost (req, res) {
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        photo: req.body.photo,
        username: req.user.username,
        categories: req.body.categories
    })
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch {
        err => res.status(500).json(err);
    }
}

// fetch post by id
async function getPostById (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch {
        err => res.status(500).json(err);
    }
}

// update post
async function updatePost (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.user.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    { $set: req.body },
                    { new: true }
                );
                res.status(200).json(updatedPost);
            } catch {
                err => res.status(500).json(500);
            }
        } else {
            return res.sendStatus(401);
        }
    } catch {
        err => res.status(500).json(err);
    }
}

// delete post
async function deletePost (req, res) {
   try {
       const post = await Post.findById(req.params.id);
       if (post.username === req.user.username) {
           await Post.deleteOne(post);
           res.status(200).json('Post deleted.');
       } else {
           return res.sendStatus(401);
       }
   } catch {
        err => res.status(500).json(err);
   }
}

module.exports = {
    newPost, 
    getPosts, 
    getPostById,
    updatePost,
    deletePost
}