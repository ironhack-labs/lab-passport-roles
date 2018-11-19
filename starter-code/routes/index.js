const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');


const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/login', (req, res, next) => {
  res.render('auth/login');
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}) );

router.get('/generalManager',checkRoles('BOSS'), (req, res, next) => {
  User.find({$or: [{ role: "DEVELOPER" }, { role: "TA" }] })
    .then((employees) => {
      res.render('auth/generalManagerIndex',{employees});
    }
    )
})

router.get('/createEmployee',checkRoles('BOSS'), (req, res, next) => {
  res.render('auth/createEmployee');
})

router.post('/createEmployee', checkRoles('BOSS'), (req, res, next) => {
    let genericEmployee=new User();
    genericEmployee.username = req.body.username;
    genericEmployee.role=req.body.role;
    genericEmployee.password=bcrypt.hashSync(req.body.password,
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

router.post('/deleteEmployee', checkRoles('BOSS'), (req, res, next) => {
  User.findByIdAndRemove(req.body.id)
    .then(() => {
      res.redirect('/generalManager');
    })
    .catch(() => {
      res.render('auth/generalManagerIndex',{errorMessage:"Error deleting the employee"});
    })
});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


module.exports = router;
