const express =require('express');
const router = express.Router();
const passport =require('passport');
const User =require('../models/User');
const bcrypt =require('bcrypt');
const bcryptSalt= 10;


function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else if (req.isAuthenticated()){
      return next();
    }else{
      console.log("Denegate, rol permission");
      res.redirect('/');
    }
  };
}

router.get('/', (req,res,next)=>{
  const id=req.user._id;
  User.find({'_id':{$ne:id}})
  .then(item =>{
    res.render('private/private-main',{item});
  })
  .catch(e =>{
    return res.render('private', {errorMessage: e.message});
  });
});

router.get('/addEmploy',checkRoles('BOSS'), (req,res,next)=>{
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
      errorMessage: 'Enter both email and password to sign up.'
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

router.get('/:id/deleteEmploy', (req, res, next) => {
  let id = req.params.id;

  User.findByIdAndRemove(id, (err, item) => {
    if (err){ return next(err); }
    return res.redirect('/private');
  });
});

module.exports=router;
