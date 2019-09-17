const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const secure = require('../middlewares/secure.mid');
const passport = require('passport');

router.get("/signup", (req, res) => {
  User.findOne({ role: "Boss" })
  .then(boss=> {
    if(boss) {
      res.redirect("/signup-new")
    }
    else {
      res.render("auth/signup")
    }
  }) 
})
router.post('/signup', (req, res, next) => {
  const { username, password, role } = req.body;
  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Please indicate username and password' });
  }
  
  User.findOne({ role: "Boss" })
    .then((user) => {
      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
     
      User.create({
        username,
        password: hashPass,
        role: "Boss",
      })
  
        .then(() => res.redirect('/login'))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.get('/signup-new', secure.checkRole('Boss'), (req, res, next) => {
  const user= req.user.username;
  res.render('auth/signup-new', { user});
});

router.post('/signup-new', (req, res, next) => {

  const { username, password, role } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup-new', { message: 'Please indicate username and password' });
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup-new', { message: 'Username already exists' });
        return;
      }
      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass,
        role,
      })
     
  
        .then(() => {
          res.redirect('/')
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
  
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local-auth', {
  successRedirect: '/',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}));

router.get("/employees", secure.checkLogin, (req, res, next) => {
  User.find({})
  .then(users => {
    res.render("employees", {users})
  })
})

router.get("/employees/:id/delete", secure.checkLogin, (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
  .then(deleted => {
    res.redirect("/employees");
  })
  .catch(error=> next(error));
});

router.get("/employees/edit/:id", secure.checkLogin, (req, res, next) => {
    console.log(req.user.role)
    let isboss=false;
    if(req.user.role=="Boss"){
      isboss=true;
    }
    User.findById(req.params.id)
    .then(finded => {
        console.log(isboss)
        res.render("edit", {finded, isboss});
 
    });
  });
  
  router.post("/employees/edit/:id",secure.checkLogin, (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body)
    .then(edited => {
      res.redirect("./employees");
    });
  });

  router.get("/employees/show/:id", secure.checkLogin, (req, res, next) => {
    User.findById(req.params.id)
    .then(employee => {

      res.render("show", {employee});
    });
  });




router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;