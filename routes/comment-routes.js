const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const { requireToken } = require('../auth/auth')

// CREATE a new comment
router.post('/', requireToken, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      post_id: req.body.post_id,
      user_id: req.user.id, // use the id of the authenticated user
    })
    const savedComment = await comment.save()
    res.json(savedComment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// READ all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.postId }).populate('user_id', 'username') // assuming User model has a 'username' field
    res.json(comments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// READ a single comment
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('user_id', 'username') // assuming User model has a 'username' field
    if (comment == null) {
      return res.status(404).json({ message: 'Cannot find comment' })
    }
    res.json(comment)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
})

// UPDATE a comment
router.patch('/:id', requireToken, getComment, async (req, res) => {
  if (req.body.content != null) {
    res.comment.content = req.body.content
  }
  try {
    const updatedComment = await res.comment.save()
    res.json(updatedComment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE a comment
router.delete('/:id', requireToken, getComment, async (req, res) => {
  try {
    await res.comment.remove()
    res.json({ message: 'Comment deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// middleware function to get a single comment by id
async function getComment(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.id)
    if (comment == null) {
      return res.status(404).json({ message: 'Cannot find comment' })
    }
    // check if the authenticated user is the author of the comment
    if (comment.user_id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    res.comment = comment
    next()
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = router
