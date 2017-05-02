const express = require("express");
const userController = express.Router();
const passport = require("../helpers/passport");
const flash    = require("connect-flash");
const User = require("../models/user");
const auth = require("../helpers/auth");


userController.get("/", auth.checkLoggedIn("/logout"), (req, res, next)=> {
  User.find({}, (err, users)=> {
    if(err) next(err);
    res.render("site-routes/users", {users});
  });

});

userController.get("/:id", auth.checkLoggedIn("/logout"), (req, res, next)=> {
  User.find({"_id": req.params.id}, (err, user)=> {
    if(err) next(err);
    res.render("site-routes/show", {user: user[0]});
  });
});

userController.get("/:id/edit", auth.checkLoggedIn("/logout"), (req, res, next)=> {
  User.find({"_id": req.params.id}, (err, user)=> {
    if(err) next(err);
    if(req.user._id == req.params.id || req.user.role == "Boss") res.render("auth/edit", {user: user[0]});
    else res.redirect("/logout");
  });
});

userController.post("/:id", auth.checkLoggedIn("/logout"), (req, res, next)=> {

  const userInfo = {
    name: req.body.name,
    username: req.body.username,
    familyName: req.body.familyName,
  };
  User.findByIdAndUpdate(req.params.id, userInfo, (err, user) => {
    if (err) next(err);
    console.log("change saved");
    res.redirect("/users");
  });
});


userController.get("/:id/delete", auth.checkLoggedIn("/logout", "Boss"), (req, res, next)=> {
  User.remove({_id: req.params.id}, (err)=> {
    if(err) next(err);
    res.redirect("/users");
  });
});

module.exports = userController;
