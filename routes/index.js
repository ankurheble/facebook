const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

/* GET home page. */
router.get("/", function(req, res, next) {
  Post.find({}, [], {
    sort: {
      createdAt: "desc"
    }
  })
    .populate("comments")
    .exec(function(err, posts) {
      if (err) {
        return res.render("error", { error: err });
      }
      res.json({
        posts: posts,
        user: req.user
      });
    });
});

router.post("/comments/:id/likes", function(req, res, next) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) res.render("error", { error: err });
    comment.likes++;
    comment.save(function(err) {
      res.json({ likes: comment.likes });
    });
  });
});

module.exports = router;
