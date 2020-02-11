const express = require('express');
const router  = express.Router();
const passport= require('passport');
const Users = require("../models/user");
const Course = require("../models/course");
const Alumni = require("../models/alumni");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('login', {
    message: req.flash("error"),
    layout: false,
  });
});

router.get("/login", (req, res, next) => {
  res.render("login", {
    message: req.flash("error"),
    layout: false
  });
});

router.post(
  '/login',
  passport.authenticate("local", {
    successReturnToOrRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/')
  })
})

router.get('/home', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Users.find()
  .then((user) => {
    res.render('home', {
      user: user,
      currentUser: req.user
      })
  })
});

router.get('/create/user', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("create-user");
});

router.post('/create/user', (req, res, next) => {
  Users.findOne({ username: req.body.username })
    .then(userExists => {
      if (userExists) {
        res.render('create/user', { error: "Course already exists" })
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);
        const newUser = new Users({
          username: req.body.username,
          password: hashPass,
          name: req.body.name,
          surname: req.body.surname,
          role: req.body.role
        })
        newUser.save(err => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/home");
          }
        })
      }
    })
    .catch(error => {
      next(error)
    })
});

router.get("/edit/user/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Users.findById(req.params.id).then(user => {
    res.render("edit", {
      user: user,
      currentUser: req.user
    });
  });
});

router.post('/edit/user/:id/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
    Users.findByIdAndUpdate(
        req.body.id,
        {
          username: req.body.username,
          name: req.body.name,
          surname: req.body.surname,
          password: hashPass
        },
        { new: true }
    )
        .then(() => {
            res.redirect('/home');
        });
});

router.get('/courses', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.find()
  .then((course) => {
    res.render('courses', {
      course: course,
      currentUser: req.user
      })
  })
});

router.get("/create/course", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render("create-course");
});

router.post('/create/course', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findOne({ season: req.body.season })
    .then(courseExists => {
      if (courseExists) {
        res.render('create-course', { error: "Course already exists" })
      } else {
        const newCourse = new Course({
          course: req.body.course,
          season: req.body.season,
          campus: req.body.campus,
          start: req.body.start,
          end: req.body.end
        })
        newCourse.save(err => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/courses");
          }
        })
      }
    })
    .catch(error => {
      next(error)
    })
});

router.get("/alumni", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Alumni.find().then(alumni => {
    res.render("alumni", {
      alumni: alumni,
      currentUser: req.user
    });
  });
});

router.get("/create/alumni", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.find().then(course => {
    res.render("create-alumni", { course });
  });
});

router.post("/create/alumni", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { name, surname, course } = req.body;
  const newAlumni = new Alumni({ name, surname, course });
  newAlumni
    .save()
    .then(alumni => {
      res.redirect("/alumni");
    })
    .catch(error => {
      console.log(error);
    });
});

router.get('/edit/alumni/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Alumni.findById(req.params.id).then(alumni => {
    res.render("edit-alumni", {
      alumni: alumni,
      currentUser: req.user
    });
  });
});

router.post('/edit/alumni/:id/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Alumni.findByIdAndUpdate(
        req.body.id,
        {
          name: req.body.name,
          surname: req.body.surname
        },
        { new: true }
    )
        .then(() => {
            res.redirect('/alumni');
        });
});

router.get('/edit/course/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Course.findById(req.params.id).then(course => {
    res.render("edit-course", {
      course: course,
      currentUser: req.user
    });
  });
});

router.post('/edit/course/:id/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Course.findByIdAndUpdate(
        req.body.id,
        {
          course: req.body.course,
          campus: req.body.campus,
          season: req.body.season,
          start: req.body.start,
          end: req.body.end
        },
        { new: true }
    )
        .then(() => {
            res.redirect('/courses');
        });
});

router.post('/delete/course/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Course.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/courses');
        });
});

router.post('/delete/alumni/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Alumni.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/alumni');
        });
});

router.post('/delete/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    Users.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/home');
        });
});


module.exports = router;
