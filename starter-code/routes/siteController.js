const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
const Course           = require("../models/curses");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
// const passportRouter = express.Router();

// const ensureLogin = require("connect-ensure-login");

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      let body = req.body
      console.log(body)
      res.redirect('my-profile')
    }
  };
};

router.get("/index", (req, res, next) => {
  res.render("signup");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {

  var username = req.body.username;
  var email = req.body.email;
  var role = req.body.role;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      email,
      password: hashPass,
      role
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "The username already exists" });
      } else {
        let body = req.body
        console.log(body)
        res.render('my-profile', body)
      }
    });
  });
});

router.get("/login", (req, res, next) => {
    res.render("login", { "message": req.flash("error") });
});


router.post("/login", passport.authenticate("local", {
      successRedirect: "/my-profile",
      failureRedirect: "/login",
      failureFlash: true,
      passReqToCallback: true
}));

router.get("/all-profiles", (req, res, next) => {
  User.find({}, function(err, users){
        if (err) return next (err);
          res.render('allProfiles', {users});
      });
});

router.get('/add-user', checkRoles('BOSS'), (req, res) => {
  res.render('addUser', {user: req.user});
});


router.get("/my-profile", (req, res, next) => {
  console.log(req.user)
  res.render("my-profile", { user: req.user});
});

router.get('/edit/:id', (req, res, next) => {
  const id = req.params.id
  User.findOne({_id: id}, function (err, user) {
    if (err) return next(err)
    console.log(user)
    res.render('edit-profile', {user})
  })
});

router.post('/edit/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  const {username, email, role} = body

  const criteria = {_id: id}
  const update = {$set: {username, email, role}}

  User.updateOne(criteria, update, function (err, user) {
    if (err) return next(err)
    User.find({}, function(err, users){
      if (err) return next (err)
        res.render('allProfiles.ejs', {users})
    });
  })
});

////////////////////////////////

router.get('/create-course', checkRoles('TA'), (req, res) => {
  res.render('create-course', {user: req.user});
});

router.post("/create-course", (req, res, next) => {

  var course = req.body.course;
  var alumns = req.body.alumns;

  if (course === "" || alumns === "") {
    res.render("create-course", { message: "Indicate course and alumns" });
    return;
  }

  User.findOne({ course }, "course", (err, course) => {
    if (course !== null) {
      res.render("create-course", { message: "The course already exists" });
      return;
    }

    var newCourse = Course({
      course : course,
      alumns : alumns
    });

    newCourse.save((err) => {
      if (err) {
        res.render("create-course", { message: "The course already exists" });
      } else {
        Course.find({}, function(err, courses){
              if (err) return next (err);
              // console.log(courses)
                res.render('courses', {courses});
        });
      }
    });
  });
});

router.get('/courses', checkRoles('TA'), (req, res) => {
  Course.find({}, function(err, courses){
        if (err) return next (err);
          res.render('courses', {courses});
      });
});

router.post('/courses/delete/:id', (req, res, next) => {
  // Iteration #5 (Bonus)
  const id = req.params.id
  const criteria = {_id: id}
  Course.remove(criteria, function (err) {
    if (err) return next(err)
    res.redirect('/courses')
  })
});

router.get('/courses/edit/:id', (req, res, next) => {
  const id = req.params.id
  Course.findOne({_id: id}, function (err, course) {
    if (err) return next(err)
    res.render('edit-course', {course})
  })
});

router.post('/courses/edit/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  const {course, alumns} = body

  const criteria = {_id: id}
  const update = {$set: {course, alumns}}

  Course.updateOne(criteria, update, function (err, course) {
    if (err) return next(err)
    Course.find({}, function(err, courses){
      if (err) return next (err)
        res.render('courses', {courses})
    });
  })
});

module.exports = router;
