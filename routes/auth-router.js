const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const passport = require('passport');

router.get('/signup', (req,res,next)=>{
  res.render("auth-views/signup-form");
});


router.post('/process-signup', (req,res,next)=> {
  const {fullName, email, password} = req.body

  if(password==="" || password.match(/[0-9]/)=== null){
    // req.flash("error", "Your password must have at least a number");
    res.redirect("/signup");
    return;
  }

   

  const salt = bcrypt.genSaltSync(10);
  const  encryptedPassword = bcrypt.hashSync(password, salt);
  // res.send({
  //   password,
  //   salt,
  //   encryptedPassword, 
  //   check: bcrypt.compareSync(password, encryptedPassword),
  //   badCheck: bcrypt.compareSync('blah', encryptedPassword)
  // });
  User.create({fullName, email, encryptedPassword})
    .then(()=>{
      // req.flash("success", " You have signed up! Try logging in. ");
      res.redirect('/');
    })
    .catch((err)=>{
      next(err);
    });
});

router.get ('/login', (req,res,next)=>{
  res.render('auth-views/login-form')
});


router.post('/process-login', (req,res,next)=>{
  const {email, password} = req.body;

  User.findOne({email})
    .then((userDetails)=>{
      if(!userDetails){
        // req.flash("error", "Wrong email");        
        res.redirect("/login");
        return;
      }
      const {encryptedPassword} = userDetails;

      if(!bcrypt.compareSync(password,encryptedPassword)) {
        // req.flash("error", "Wrong password");                
        res.redirect('/login');
        return;
      }

      req.login(userDetails, () => {
        // req.flash("success", "log in successfull");                
        res.redirect("/");
      });
      // req.session.isloggedIn = true;
     
    })
    .catch((err)=>{
      next(err);
    });
  // res.send(req.body);
});

router.get('/admin/users/:userId/delete', (req, res, next)=>{
  User.findByIdAndRemove(req.params.userId) 
    .then(()=>{
      res.redirect("/admin/users")
    })
    .catch((err)=>{
      next(err);
    })
})

router.get('/edit', (req,res,next) => {
  res.render('auth-views/edit-form');
})

router.post('/process-edit', (req,res,next) => {
  const {fullName, email, password} = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {fullName, email, password},
    {runValidators: true}
  )
    .then(()=> {
      res.redirect('/');
    })
    .catch((err)=>{
      next(err);
    })
})

router.get('/logout', (req,res, next)=>{
  req.logout();
  // req.flash("success", "log out successfull");                  
  res.redirect('/');
})

module.exports = router;
