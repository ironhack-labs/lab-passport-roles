const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');


const User = require('../models/User');

/* GET home page */
router.get('/', isAuthenticated(), (req, res, next) => {
  let role = req.user.role;
  User.find({ $or: [{ role: "DEVELOPER" }, { role: "TA" }] })
    .then((employees) => {
      res.render('auth/index', { employees, role });
    }
    )
});


router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get('/createEmployee', checkRoles(['BOSS']), (req, res, next) => {
  res.render('auth/createEmployee');
})

router.post('/createEmployee', checkRoles(['BOSS']), (req, res, next) => {
  let genericEmployee = new User();
  genericEmployee.username = req.body.username;
  genericEmployee.role = req.body.role;
  genericEmployee.password = bcrypt.hashSync(req.body.password,
    bcrypt.genSaltSync(process.env.BCRYP_SALT)
  );
  genericEmployee.save()
    .then(() => {
      res.redirect('/generalManager');
    })
    .catch(() => {
      res.redirect('/createEmployee');
    })
});

router.post('/deleteEmployee', checkRoles(['BOSS']), (req, res, next) => {
  User.findByIdAndRemove(req.body.id)
    .then(() => {
      res.redirect('/generalManager');
    })
    .catch(() => {
      res.render('auth/generalManagerIndex', { errorMessage: "Error deleting the employee" });
    })
});

router.get('/profile/:id', isAuthenticated(), (req, res, next) => {
  let role = req.user.role;
  User.findById(req.params.id)
    .then((employee) => {
      res.render('auth/profile', { employee, role })

    })
    .catch(() => {
      res.render('auth/index', { errorMessage: "Error accessing to the profile" });
    })
});

router.get('/editProfile', isAuthenticated(), (req, res, next) => {
  let user = req.user;
  res.render('auth/editProfile', { user });
})

router.post('/editProfile', isAuthenticated(), (req, res, next) => {
  let id = req.user.id;
  let newUser = {};
  newUser.username = req.body.username;
  if (newUser.password !== "") {
    newUser.password = bcrypt.hashSync(req.body.password,
      bcrypt.genSaltSync(process.env.BCRYP_SALT));
  }
  console.log(newUser);
  User.findByIdAndUpdate(id, newUser)
  res.redirect(`/profile/${id}`);
})


function checkRoles(roles) {
  return function (req, res, next) {
    if (req.isAuthenticated() && roles.some(role => req.user.role === role)) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

function isAuthenticated() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else {
      res.redirect('/login');
    }
  }
}

// function isUser(userId) {
//   return function (req, res, next) {
//     if (isAuthenticated() && req.user.id == userId) {
//       return next();
//     }
//     else {
//       res.redirect('/');
//     }
//   }
// }

module.exports = router;
