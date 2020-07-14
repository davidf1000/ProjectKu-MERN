const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { route } = require('./profile');

// @route     POST api/post
// @desc       Create a POST
// @access      private

router.post(
  '/',
  [auth, check('text', 'Text is Required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Don't send the password
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error !');
    }
  }
);

// @route     GET api/post
// @desc       GET all POST
// @access      private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error !');
  }
});

// @route     GET api/post/:id
// @desc       GET single post by ID
// @access      private

router.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: 'Msg not found !' });
    }
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error !');
  }
});

// @route     Delete api/post/:id
// @desc       delete post by id
// @access      private

router.delete('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: 'Error !' });
    }
    // check user
    if (posts.user.toString() != req.user.id) {
      return res.status(404).json({ msg: 'Not Authorized !' });
    }
    //Remove
    await posts.remove();
    res.json({ msg: 'post removed !' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error !');
  }
});

// @route     PUT api/post/like/:id
// @desc       Like post by id
// @access      private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if post has already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'post already liked !' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error !');
  }
});

// @route     PUT api/post/unlike/:id
// @desc       unlike post by id
// @access      private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if post has already liked
    if (
      !(
        post.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      )
    ) {
      return res.status(400).json({ msg: 'post Havent liked !' });
    }
    //get removed index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    if (removeIndex === -1) {
      return res.status(400).json({ msg: ' User didn"t liked this post !' });
    }
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error !');
  }
});

// @route     POST api/post/comment/:id
// @desc       Comment on a post 
// @access      private

router.post(
  '/comment/:id',
  [auth, check('text', 'Text is Required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Don't send the password
      const user = await User.findById(req.user.id).select('-password');
        const post= await Post.findById(req.params.id);

      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      post.comments.unshift(newComment);
      console.log(post);
      const posts = await post.save();
      res.json(posts.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error !');
    }
  }
);

// @route     DELETE api/post/comment/:id/:comment_id
// @desc       Delete comment by id
// @access      private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //Get comment 
        const comment= post.comments.find(comm=>comm.id===req.params.comment_id);
        console.log(comment);
        
        //Make sure comments exist 
        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'});
        }
        // Check user 
        if(comment.user.toString()!= req.user.id){
            return res.status(401).json({msg:'User not authorized'});
        }
        //Get remove index
        const removeIdx=post.comments.map(cmt=>cmt.user.toString()).indexOf(req.user.id);
        if(removeIdx===-1)
        {
            return res.status(404).json({msg:'Idx not found !'});
        }
        console.log(removeIdx);
        post.comments.splice(removeIdx,1);
        await post.save();

        res.json(post.comments);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error !');
    }
  });

module.exports = router;
