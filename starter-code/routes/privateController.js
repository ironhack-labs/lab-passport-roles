const express =require('express');
const router = express.Router();
const passport =require('passport');
const User =require('../models/User');
const bcrypt =require('bcrypt');
const bcryptSalt= 10;
const {ensureLoggedIn, ensureLoggedOut}= require('connect-ensure-login');
const checkRoles=require('../middleware/checkRol');

router.get('/',ensureLoggedIn('auth/',{errorMessage: 'Is not logged'}),(req,res,next)=>{
  const id=req.user._id;
  User.find({'_id':{$ne:id}})
  .then(item =>{
    res.render('private/private-main',{item});
  })
  .catch(e =>{
    return res.render('private', {errorMessage: e.message});
  });
});

router.post('/viewProfile',ensureLoggedIn('/'),checkRoles('TA'), (req,res,next)=>{
  let username=req.body.username;
  User.findOne({username})
    .then(item=>{
      if(!item){
        throw new Error (`There isn't username ${username}.`);
      }else{
        res.render('private/viewProfile', {item});
      }
    })
    .catch(e=>{
      return res.render('private/private-main', {errorMessage: e.message});
    });
});

router.get('/addEmploy',checkRoles('BOSS'),ensureLoggedIn('/'), (req,res,next)=>{
  res.render('private/addEmploy');
});

router.post('/addEmploy',checkRoles('BOSS'), (req, res, next) => {
  const nameInput = req.body.name;
  const userNameInput = req.body.username;
  const passwordInput = req.body.password;
  const roleInput=req.body.role;
  const familyNameInput =req.body.familyName;

  if (userNameInput === '' || passwordInput === '') {
    res.render('private/addEmploy', {
      errorMessage: 'Enter both user Name and password to sign up.'
    });
    return;
  }

  User.findOne({ username: userNameInput}, '_id', (err, item) => {
    if (err) {
      next(err);
      return;
    }

    if (item !== null) {
      res.render('private/addEmploy', {
        errorMessage: `The username ${userNameInput} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(passwordInput, salt);

    const userSubmission = {
      name: nameInput,
      username: userNameInput,
      password: hashedPass,
      role: roleInput,
      familyName : familyNameInput
    };

    const theUser = new User(userSubmission);

    theUser.save((err) => {
      if (err) {
        res.render('private/addEmploy', {
          errorMessage: 'Something went wrong. Try again later.'
        });
        return;
      }

      res.redirect('/private');
    });
  });
});

router.get('/editProfile',ensureLoggedIn('/'),checkRoles('TA'),(req,res,next)=>{
  res.render('private/editProfile', {item:req.user });
});

router.post('/:id/editProfile',ensureLoggedIn('/'),checkRoles('TA'),(req,res,next)=>{
    let id = req.params.id;

    const updates = {
      name: req.body.name,
      familyName: req.body.familyName,
    };

    User.findByIdAndUpdate(id, updates, (err, item) => {
      if (err){ return next(err); }
      return res.redirect('/private');
    });
  });


  router.get('/viewProfile', (req,res,next)=>{
    let username=req.body.username;
    User.find({username})
    .then(iten=>{
        res.render('private/profile', {item:item });
    })
    .catch (e=>{
      return res.render('private', {errorMessage: e.message});
    });
  });

router.get('/:id/deleteEmploy', ensureLoggedIn('/'),checkRoles('BOSS'),(req, res, next) => {
  let id = req.params.id;

  User.findByIdAndRemove(id, (err, item) => {
    if (err){ return next(err); }
    return res.redirect('/private');
  });
});

module.exports=router;
