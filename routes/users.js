const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/profile", function(req, res, next) {
  User.findById(req.user.id)
    .populate("friends")
    .exec(function(err,user) {
      if(err) res.render("error",{error: err});
      res.render("profile", { user: user });
    });
});

router.post("/profile", function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    console.log(req.body);
    user.name = req.body.name;
    user.email = req.body.email;
    user.save();
    res.redirect("/user/profile");
  });
});

module.exports = router;
