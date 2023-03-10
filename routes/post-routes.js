const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const auth = require('../config/auth')

// CREATE a new post
router.post('/posts', auth.requireToken, (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    user_id: req.user.id // use the id of the authenticated user
  })

  post.save()
    .then(savedPost => {
      res.json(savedPost)
    })
    .catch(err => {
      next(err)
    })
})

// INDEX all posts
router.get('/posts', auth.requireToken, (req, res, next) => {
  Post.find()
    .populate('user_id')
    .then(posts => {
      res.json(posts)
    })
    .catch(err => {
      next(err)
    })
})

// READ a single post
router.get('/posts/:id', auth.requireToken, getPost, (req, res) => {
  res.json(res.post)
})

// UPDATE a post
router.patch('/posts/:id', auth.requireToken, getPost, (req, res, next) => {
  if (req.body.title != null) {
    res.post.title = req.body.title
  }
  if (req.body.content != null) {
    res.post.content = req.body.content
  }

  res.post.save()
    .then(updatedPost => {
      res.json(updatedPost)
    })
    .catch(err => {
      next(err)
    })
})

// DELETE a post
router.delete('/posts/:id', auth.requireToken, getPost, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json({ message: 'Post deleted' })
    })
    .catch(err => {
      next(err)
    })
})

// middleware function to get a single post by id
function getPost(req, res, next) {
  Post.findById(req.params.id)
    .populate('user_id')
    .then(post => {
      if (post == null) {
        return res.status(404).json({ message: 'Cannot find post' })
      }
      res.post = post
      next()
    })
    .catch(err => {
      next(err)
    })
}

module.exports = router
