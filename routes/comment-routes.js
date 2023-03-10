const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const Post = require('../models/post')
const auth = require('../config/auth')

// CREATE a new comment for a post
// router.post('/posts/:postId/comments', auth.requireToken, (req, res, next) => {
//   const comment = new Comment({
//     content: req.body.content,
//     user_id: req.user.id,
//     post_id: req.params.postId
//   })

//   comment.save()
//     .then(savedComment => {
//       return Post.findByIdAndUpdate(req.params.postId, { $push: { comments: savedComment._id } }, { new: true })
//     })
//     .then(updatedPost => {
//       res.json(updatedPost)
//     })
//     .catch(err => {
//       next(err)
//     })
// })
router.post('/posts/:postId/comments', auth.requireToken, (req, res, next) => {
    const comment = new Comment({
      content: req.body.content,
      user_id: req.user.id,
      post_id: req.params.postId
    })
  
    comment.save()
      .then(savedComment => {
        res.json(savedComment)
      })
      .catch(err => {
        next(err)
      })
  })  
  

// READ all comments for a post
router.get('/posts/:postId/comments', auth.requireToken, (req, res, next) => {
  Comment.find({ post_id: req.params.postId })
    .populate('user_id')
    .then(comments => {
      res.json(comments)
    })
    .catch(err => {
      next(err)
    })
})

// READ a single comment
router.get('/comments/:id', auth.requireToken, getComment, (req, res) => {
  res.json(res.comment)
})

// UPDATE a comment
router.patch('/comments/:id', auth.requireToken, getComment, (req, res, next) => {
  if (req.body.content != null) {
    res.comment.content = req.body.content
  }

  res.comment.save()
    .then(updatedComment => {
      res.json(updatedComment)
    })
    .catch(err => {
      next(err)
    })
})

// DELETE a comment
router.delete('/comments/:id', auth.requireToken, getComment, (req, res, next) => {
    Comment.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json({ message: 'Comment deleted' })
    })
    .catch(err => {
      next(err)
    })
})

// middleware function to get a single comment by id
function getComment(req, res, next) {
  Comment.findById(req.params.id)
    .populate('user_id')
    .then(comment => {
      if (comment == null) {
        return res.status(404).json({ message: 'Cannot find comment' })
      }
      res.comment = comment
      next()
    })
    .catch(err => {
      next(err)
    })
}

module.exports = router
