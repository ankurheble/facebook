const express = require("express");
const router = express.Router();
// const passport = require("../config/passport");
const loginController = require("../controllers/loginController");
const User = require('../models/User');

router.get("/login", loginController.show);

router.post(
  "/login",
  // passport.authenticate("local", {
  //   successRedirect: "/",
  //   failureRedirect: "/auth/login",
  // })
  function(req,res){
    User.findById(req.body.userId,function(err,user){
      res.redirect('/');
    })
  }
);

router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;
