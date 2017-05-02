var express = require('express');
var router = express.Router();

const auth        = require("../helpers/auth");
// User model
const User        = require("../models/user");
const addUser     = require("../helpers/adduser");
const bcrypt     = require("bcrypt");
const bcryptSalt = 10;
var checkBoss = auth.checkRoles("BOSS");
var checkUser = auth.checkRoles(["DEVELOPER", "TA"]);

router.get("/user", checkUser, (req, res)=>{
  User.find({$or:[{"role":"DEVELOPER"}, {"role":"TA"}]}, (err, users)=>{
    res.render('user', {users, "user":req.user});
  });
});

router.get("/user/:userId", checkUser, (req, res)=>{
  if(req.params.userId!==req.user.id) {
    res.redirect('/users');
    return;
  }
  res.render('user_edit', {user: req.user});
})

router.post("/user/:userId", checkUser, (req, res)=>{
  if(req.params.userId!==req.user.id) {
    res.redirect('/user');
    return;
  }
   const username = req.body.username;
   const password = req.body.password;


  if (username === "" || password === "") {
    res.render("user_edit", { user: req.user, message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {

    if (user !== null && user._id!=req.user.id) {
      res.render("user_edit", { user: req.user, message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.findOneAndUpdate({"_id":req.user.id}, {
      username: username,
      password: hashPass,
    }, (err, user)=>{
      if(err) {next(err); return;}
      res.redirect('/user');
    });
  });
});

router.get("/boss", checkBoss, (req, res)=>{
  User.find({}, (err,users)=>{
    if(err) {next(err); return;}
      res.render("boss", {users});
  })
  
})

router.post("/boss", checkBoss, (req, res)=>{
  addUser(req, res, "boss", "/boss")
});

router.post("/boss/:userId", checkBoss, (req, res)=>{
  User.findOneAndRemove({"_id":req.params.userId}, (err)=>{
    if(err) {next(err); return}
    res.redirect('/boss');
  });
});

module.exports = router;