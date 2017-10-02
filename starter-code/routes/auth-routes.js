// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


// User model
const User = require("../models/user");
// Course model
const Course = require("../models/course");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// SIGN UP
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  });
});

// CHECK ROLES FUNCTION

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

// LOG IN

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", {"message": req.flash("error")});
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// FB LOGIN

authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/login"
}));

// PRIVATE PAGES
authRoutes.get("/private-page", (req, res, next) => {
  next();
},ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

// ADD REMOVE USERS

authRoutes.get("/addremove", checkRoles("Boss"),(req, res, next) => {
  res.render("auth/addremove", {user: req.user});
});

authRoutes.post("/addremove", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const name = req.body.name;

  if (name === "" || username === "" || password === "" || role === "") {
    res.render("auth/addremove", { message: "All fields need to be filled in" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/addremove", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
      name: name,
      role: role,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/addremove", { message: "Something went wrong" });
      } else {
        res.redirect("/addremove");
      }
    });
  });
});

// ADD COURSES

authRoutes.get("/courses", checkRoles("TA"),(req, res, next) => {
  res.render("auth/courses", {user: req.user});
});

authRoutes.post("/courses", (req, res, next) => {
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  let available;

  let x = req.body.available;
  if(x==="true"){
    available = true;
  } else {
    available = false;
  }

  if (name === "" || startingDate === "" || endDate === "" || level === "" || available === "") {
    res.render("auth/courses", { message: "All fields need to be filled in" });
    return;
  }

  Course.findOne({ name }, "name", (err, course) => {
    if (course !== null) {
      res.render("auth/courses", { message: "This course already exists" });
      return;
    }

    const newCourse = new Course({
      name: name,
      startingDate: startingDate,
      endDate: endDate,
      level: level,
      available: available,
    });

    newCourse.save((err) => {
      if (err) {
        res.render("auth/courses", { message: "Something went wrong" });
      } else {
        res.redirect("/courses");
      }
    });
  });
});

// LOG OUT
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


module.exports = authRoutes;
