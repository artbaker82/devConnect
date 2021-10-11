const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route  POST api/posts
//@desc   Create a post
//@access  Private
router.post("/", [auth, [
    check('text', 'Text is required').not().isEmpty()
] ] , async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    //we have access to req.user.id from auth middleware
    const user = await User.findById(req.user.id).select('-password');


    try {
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
});

//@route  GET api/posts
//@desc   Get all posts
//@access  Private

router.get('/', auth, async (req,res) => {
    try {
        //get posts sort by recent first(-1)
        const posts = await Post.find().sort({ date: -1});
        
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route  GET api/posts/:id
//@desc   Get post by id
//@access  Private

router.get('/:id', auth, async (req,res) => {
    try {
        //get posts sort by recent first(-1)
        const post = await Post.findById(req.params.id);

        if (!post) {
           return res.status(404).json({msg: 'Post not Found'})
        }
        
        res.json(post)
    } catch (err) {
        console.error(err.message);
        //checking if post type is ObjectId, so that we can use the same err message, even if not a valid id
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not Found'})
         }
        res.status(500).send('Server Error')
    }
});

//@route  Delete api/posts/:id
//@desc   Delete a post
//@access  Private

router.delete('/:id', auth, async (req,res) => {
    try {
        //get posts sort by recent first(-1)
        const post = await Post.findById(req.params.id);

        //make sure that user deleting post is author of the post

        if (!post) {
            return res.status(404).json({msg: 'Post not Found'})
         }
        
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'})
        }

        await post.remove()
        res.json({msg: 'Post removed'})
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({msg: 'Post not Found'})
         }
        res.status(500).send('Server Error')
    }
});

//@route  PUT api/posts/like/:id
//@desc   Like a post
//@access  Private

router.put('/like/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({msg: 'Post not Found'})
         }

        //check if post has already been liked by this user
        //filter through array of likes, if like.user is equal to the logged in user, then it has already been liked by that user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: 'Already Liked'})
        }

        post.likes.unshift({user: req.user.id})

        await post.save()
        //returns just to likes on the given post
        res.json(post.likes)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
});


//@route  PUT api/posts/unlike/:id
//@desc   unlike a post
//@access  Private

router.put('/unlike/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({msg: 'Post not Found'})
         }

        //check if post has already been liked by this user
        //filter through array of likes, if the returned array is zero, then the post has not been liked
        //like.user.tostring because objectId is not a string
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: 'Post has not yet been liked'})
        }

        //remove post
        //get remove index
        //map over all likes, create array of only the user who liked each post, get index of the post that matches the current user
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)

        await post.save()
        //returns just to likes on the given post
        res.json(post.likes)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
});

//@route  POST api/posts/comment/:id
//@desc   Comment on a post
//@access  Private
router.post("/comment/:id", [auth, [
    check('text', 'Text is required').not().isEmpty()
] ] , async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    



    try {
        //we have access to req.user.id from auth middleware
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);


        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    
});

//@route  DELETE api/posts/comment/:id/:comment_id
//@desc   Delete comment
//@access  Private

router.delete('/comment/:id/:comment_id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        //pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        

        //check if comment exists
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found"})
        }

        //check if user that deletes is author of comment

        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'})            
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments)
        
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})




module.exports = router