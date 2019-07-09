const express = require('express');
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require('passport');
const User = require('../models/user')
const Course = require('../models/course')
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.user;
  res.render('index', {user});
});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
})
);

function checkRoles(role) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

router.get('/signup', checkRoles('boss'), (req, res) => {
  const role = ['boss', 'developer', 'TA']
  res.render('signup', {role});
})

router.post('/signup', (req, res) => {
  const { username, password, role } = req.body;


  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: role,
      });

      newUser.save((err) => {
        if (err) {
          res.render("signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.get('/allusers', ensureLogin.ensureLoggedIn(), (req, res) => {
  User.find().then(user => {
    res.render('data', {user})
  })
});

router.get('/edit', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.user.username);
  User.findOne( {username: req.user.username} )
  .then(user => {
    res.render('edit', user)
  }).catch(err => console.log(err))
});

router.post('/edit', (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.update({ username: username}, { $set: {password: hashPass}})
  .then(user => {
    res.redirect('/edit')
  }).catch(err => console.log(err))
});

router.get('/addcourse',checkRoles('TA'), (req, res) =>{
  res.render('addCourse')
});

router.post('/addcourse', checkRoles('TA') , (req, res) => {
  const newCourse = new Course({
    name: req.body.name,
    description: req.body.description,
    owner: req.user.id, 
  });

  newCourse.save((err) => {
    if (err) {
      res.render("addCourse", { message: "Something went wrong" });
    } else {
      res.redirect("/");
    }
  });
});

router.get('/editcourse',checkRoles('TA'), (req, res) =>{
  res.render('editCourse')
});

// router.post('/editcourse', (req, res) => {
//   const { _id ,name, description } = req.body;

//   User.update({ id: _id}, { $set: {name: name, description: description}})
//   .then(user => {
//     res.redirect('/edit')
//   }).catch(err => console.log(err))
// });

module.exports = router;
