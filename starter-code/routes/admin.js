const express = require("express");
const admin = express.Router();

const { ensureLoggedIn, ensureLoggedOut } = require("../middlewares/auth");
const passport = require("passport");

const User = require("../models/user");

admin.get("/", (req, res, next) => {
  res.render("admin/admin-panel", { user: req.user });
});

admin.post("/userlist/:id/delete", ensureLoggedIn, (req, res, next) => {
  const id = req.params.id;
  console.log("deleting user:", id);

  User.findByIdAndRemove(id, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/admin-panel/userlist");
  });
});

admin.get("/userlist", ensureLoggedIn, (req, res, next) => {
  console.log("trying to access userlist");
  User.find({}, (err, users) => {
    if (err) return next(err);
    res.render("admin/userlist", {
      users
    });
  });
});

admin.get("/showuser/:id", (req, res, next) => {
  const id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) return next(err);
    res.render("admin/showuser", {
      user
    });
  });
});

admin.get("/:id/edit", ensureLoggedIn, (req, res, next) => {
  res.render("admin/edit", { user: req.user });
});

admin.post("/:id/edit", ensureLoggedIn, (req, res, next) => {
  console.log(req.params);
  const id = req.params.id;

  const updates = {
    username: req.body.username,
    name: req.body.name,
    familyName: req.body.familyName,
    role: req.body.role,
  };

  User.findByIdAndUpdate(id, updates, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.redirect(`/admin-panel/showuser/${user.id}`);
  });
});

admin.post("/new", ensureLoggedIn, (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  });
  user.save((err, user) => {
    if (err) return next(err);
    res.redirect("/admin-panel/userlist");
  });
});

module.exports = admin;
