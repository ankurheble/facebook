const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: String,
<<<<<<< HEAD
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    Post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    likes: Number
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;
=======
    likes: { type: Number, default: 0 },
    post: {
      ref: "Post",
      type: mongoose.Schema.Types.ObjectId
    },
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Comment", commentSchema);
>>>>>>> feature/wall-ui
