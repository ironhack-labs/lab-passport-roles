const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();
const bcryptSalt = 10;
const { ensureLoggedIn, hasRole } = require('../routes/middleware/ensureLoggedIn');

router.get('/login', (req, res, next) => {  
  res.render('login');
});

/*
router.get('/login', [
    ensureLoggedIn('/login'), 
    hasRole('Boss'),
] , (req,res) => {
    res.render('signup');
})
*/
router.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/signup",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
})
)

/*router.get('/login', (req, res, next) => {  
  res.render('login');
});*/

router.get('/signup',  [
  ensureLoggedIn('/userlistedit'), 
  hasRole('Boss'),
] , (req,res) => {
  res.render('signup');
})


router.post('/signup', (req, res, next) => {

  const {
    username,
    password,
    role
  } = req.body;

  User.findOne({
      username
    })
    .then(user => {
      console.log(user);
      if (user !== null) {
        throw new Error("Username Already exists");
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role: [req.body.role]
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/auth/userlist");
    })
    .catch(err => {
      console.log(err);
      res.render("/signup", {
        errorMessage: err.message
      });
    })
})

/* C(R)UD: Retrieve -> List all users */
router.get('/userlist', (req, res, next) => {
  User.find({}).sort({updated_at:-1}).then( users => {
    res.render('userlist', {users});
  })
});

/* CRU(D): Delete the user in DB */
router.get('/userlist/delete/:id',(req,res) => {
  console.log(`Este es el param id: ${req.params.id}`)
  User.findByIdAndRemove(req.params.id, () => res.redirect('/auth/userlist'));
})

/* C(R)UD: Retrieve -> List all users */
router.get('/userlistedit', (req, res, next) => {
  User.find({}).sort({updated_at:-1}).then( users => {
    res.render('userlistEdit', {users});
  })
});








module.exports = router;