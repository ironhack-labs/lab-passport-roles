const express = require("express");
const siteController = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const checkRoles = require('../middlewares/checkRole');
const actualUser = require('../middlewares/actualUser');
const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


/* ===================== USERS ===================== */
//get index
siteController.get("/", (req, res, next) => {
  User.find().exec((err, users) => {
    res.render("index", {
      users: users
    });
  });
});

//post index login
siteController.post("/", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/"
}));

siteController.get('/boss', checkRoles('Boss'), function (req, res, next) {
  User.find().exec((err, users) => {
    res.render('boss', {
      users: users
    });
  });
});

//post new user
siteController.post("/boss", (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("boss", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("boss", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username,
      name,
      familyName,
      password: hashPass,
      role
    });
    newUser.save((err) => {
      if (err) {
        res.render("boss", {
          message: "Something went wrong"
        });
      } else {
        res.redirect("/boss");
      }
    });
  });
});



//GET edit profiles
siteController.get('/edit/:id', actualUser, (req, res) => {
  const userId = req.params.id;
  User.findById(userId, (err, user) => {
    // console.log(typeof (req.params.id));
    // console.log(typeof (user._id));
    if (err) {
      return next(err);
    }
    res.render('edit-user', {
      user: user
    });
  });
})

//GET view profiles
siteController.get('/view-user/:id', (req, res) => {
  const userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) {
      return next(err);
    }
    res.render('view-user', {
      user: user
    });
  });
})

// post edit profiles
siteController.post('/edit/:id', actualUser, (req, res) => {
  const userId = req.params.id;
  const {
    username,
    name,
    familyName,
    password,
    confirmPassword
  } = req.body;
  var updates;
  if ((password != '') && (confirmPassword != '')) {
    if (password === confirmPassword) {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      updates = {
        username,
        name,
        familyName,
        password: hashPass
      };
    } else {
      res.render('edit-user', {
        errorMessage: "The passwords do not match!"
      });
      return;
    }
  } else {
    updates = {
      username,
      name,
      familyName
    };
  }

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.redirect(`/`);
  });
})


//delete users
siteController.get('/delete/:id', checkRoles('Boss'), (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/boss');
  });
});


//logout
siteController.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


/* ===================== COURSES ===================== */

//get courses
siteController.get('/courses', checkRoles('TA'), function (req, res, next) {
  Course.find().exec((err, courses) => {
    res.render('courses', {
      courses: courses
    });
  });
});


//get new course
siteController.get('/new-course', checkRoles('TA'), function (req, res, next) {
  res.render('new-course');
});

//post new course
siteController.post("/new-course", (req, res, next) => {
  const name = req.body.name;
  const startingDate = req.body.startingDate;
  const endDate = req.body.endDate;
  const level = req.body.level;
  const available = req.body.available;

  if (name === "" || startingDate === "" || endDate === "" || level === "" || available === '') {
    res.render("new-course", {
      message: "Fill out all fields"
    });
    return;
  }

  Course.findOne({
    name
  }, "name", (err, course) => {
    if (course !== null) {
      res.render("new-course", {
        message: "The course name already exists"
      });
      return;
    }

    const newCourse = new Course({
      name,
      startingDate,
      endDate,
      level,
      available
    });
    newCourse.save((err) => {
      if (err) {
        res.render("new-course", {
          message: "Something went wrong"
        });
      } else {
        res.redirect("/courses");
      }
    });
  });
});

//get edit course
siteController.get('/edit-course/:id', checkRoles('TA'), (req, res) => {
  const courseId = req.params.id;
  Course.findById(courseId, (err, course) => {
    if (err) {
      return next(err);
    }
    res.render('edit-course', {
      course: course
    });
  });
});


// post edit course
siteController.post('/edit-course/:id', checkRoles('TA'), (req, res) => {
  const courseId = req.params.id;
  const {
    name,
    startingDate,
    endDate,
    level,
    available
  } = req.body;
  const updates = {
    name,
    startingDate,
    endDate,
    level,
    available
  };

  Course.findByIdAndUpdate(courseId, updates, (err, user) => {
    console.log(updates);
    if (err) {
      return next(err);
    }
    return res.redirect(`/courses`);
  });

});



//delete course
siteController.get('/delete-course/:id', checkRoles('TA'), (req, res) => {
  const id = req.params.id;
  Course.findByIdAndRemove(id, (err, course) => {
    if (err) {
      return next(err);
    }
    return res.redirect('/courses');
  });
});

module.exports = siteController;