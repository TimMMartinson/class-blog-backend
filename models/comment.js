const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Comment', commentSchema)
