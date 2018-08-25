const Comment = require("../models/Comment");
const Post = require("../models/Post");

module.exports = {
  create: function(req, res) {
    const post = req.body.post;
    Post.create(
      {
        content: post,
      },
      function(err, post) {
        res.json({ post: post });
      }
    );
  },
  addComment: function(req, res) {
    const id = req.params.id;
    Comment.create({ content: req.body.comment, post: id }, function(
      err,
      comment
    ) {
      Post.findById(id, function(err, post) {
        if (post.comments) {
          post.comments.push(comment);
        } else {
          post.comments = [];
          post.comments.push(comment);
        }
        post.save(function(err, post) {
          Post.findById(post.id)
            .populate("comments")
            .exec(function(err, post) {
              res.json({ post: post, comment: comment });
            });
        });
      });
    });
  },
  likePost: function(req, res) {
    const id = req.params.id;
    Post.findById(id, function(err, post) {
      if (err) res.render("error", { error: err });
      post.likes++;
      post.save(function(err) {
        res.json({ updatedLikes: true });
      });
    });
  }
};
