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
  } else if (req.user.role === 'Alumni') {
    res.redirect(`/dashboard/alumniPage/${req.user._id}`);
  } else {
    res.redirect(`/dashboard/home/${req.user._id}`);
  }
});

router.get('/alumniPage/:id', (req, res, next) => {

  User.find({role: 'Alumni'})
  .then(users => {
   
    var update;
    
    if (req.params.id == req.user._id || req.user.role !== 'Alumni') {
      update = true;
    } else {
      update = false;
    }

      var mainUser = users.filter(user => {
        return user._id == req.params.id
      })
  
    let usersObject = {users:users, user:mainUser, update: update, userLogged: req.user}

    res.render('ironhack/alumniPage', {usersObject})
  })
  .catch(err => console.log(err))

});

router.get('/home/:id', (req,res,next) => {

  User.find({})
  .then(users => {
    var update;
    if (req.params.id == req.user._id || req.user.role === 'Boss') {
      update = true;
    } else {
      update = false;
    }

      var mainUser = users.filter(user => {
        return user._id == req.params.id
      })

      var alumniUsers = users.filter(user => {
        return user.role === 'Alumni'
      })

      console.log(mainUser);
  
    let usersObject = {users:users, user:mainUser, update: update, userLogged: req.user, alumniUsers: alumniUsers}
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


router.post('/home/:id/edit', (req, res, next) => {

  console.log(req.params.id);
  User.updateOne({_id: req.params.id}, { $set: {username: req.body.username, role: req.body.role}})
  .then(() => {
    res.redirect(`/dashboard/home/${req.params.id}`);
  })
  .catch((error) => {
    console.log(error);
  })

});





// router.get("/", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("ironhack/dashboard", { user: req.user });
// });


module.exports = router;
