const express = require('express');
const router  = express.Router();
const ensureLogin = require("connect-ensure-login");
const User         = require('../models/User');

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;



router.get('/', (req, res, next) => {
  if (req.user.role === 'Boss') {
    res.redirect('/dashboard/bossPage');
  } else {
    res.redirect(`/dashboard/home/${req.user._id}`);
  }
});

router.get('/home/:id', (req,res,next) => {

  User.find({})
  .then(users => {
    var update;
    if (req.params.id == req.user._id) {
      update
    }
  
    let usersObject = {users:users, user:req.user}
    res.render('ironhack/home', {usersObject})
  })
  .catch(err => console.log(err))
})


router.get('/bossPage', (req,res,next) => {
  User.find()
  .then(users => {
    const newUsers = {users: users, userName: req.user.username}
    res.render('ironhack/bossPage', {newUsers})
  })
})


router.post('/newUser', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === '' || password === '') {
    res.render('ironhack/bossPage', {message: 'Indicate username please.'});
    return;
  }

  User.findOne({username})
  .then(user => {
    if (user !== null) {
      res.render('ironhack/bossPage', {message: 'This user already exists.'})
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      username,
      password: hashPass,
      role: role
    })

    newUser.save((err) => {
      if (err) {
        res.render('ironhack/bossPage', {message: 'Something went wrong'})
      } else {
        res.redirect('/dashboard/bossPage');
      }
    })

  })

})

router.get('/:id/delete', (req, res, next) => {
  User.findByIdAndRemove({_id: req.params.id})
  .then(() => res.redirect('/dashboard/bossPage'))
  .catch(err => console.log(err))
});


// router.get("/", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("ironhack/dashboard", { user: req.user });
// });


module.exports = router;
