const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const { requireToken } = require('../auth/auth')

// CREATE a new post
router.post('/', requireToken, async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      user_id: req.user.id // use the id of the authenticated user
    })
    const savedPost = await post.save()
    res.json(savedPost)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// READ all posts
router.get('/', requireToken, async (req, res) => {
  try {
    const posts = await Post.find().populate('user_id', 'username') // assuming User model has a 'username' field
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// READ a single post
router.get('/:id', requireToken, getPost, (req, res) => {
  res.json(res.post)
})

// UPDATE a post
router.patch('/:id', requireToken, getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title
  }
  if (req.body.content != null) {
    res.post.content = req.body.content
  }
  try {
    const updatedPost = await res.post.save()
    res.json(updatedPost)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE a post
router.delete('/:id', requireToken, getPost, async (req, res) => {
  try {
    await res.post.remove()
    res.json({ message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// middleware function to get a single post by id
async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' })
    }
    res.post = post
    next()
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = router
