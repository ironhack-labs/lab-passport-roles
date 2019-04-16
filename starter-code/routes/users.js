const express = require('express');
const router  = express.Router();
//
const User = require('../models/user');
const bcrypt= require('bcrypt');

router.get('/', (req, res, next) => {
  User.find({})
  .then((users)=>{
    //res.json(users);
    console.log(req.body);
    res.render('users/index', {users});
  })
  .catch((err)=>{
    console.log(err);
  })
});

router.get('/new', (req, res, next) => {
  const data = {
    action: "new"
  }
  res.render('users/new', data);
});

router.post('/', (req, res, next) => {  
  let { username, name, surname, address, password, role } = req.body;
  password = bcrypt.hashSync( password, 10);
  const newUser = new User({ username, name, surname, address, password, role })
  newUser.save()
    .then((user) => {
      res.redirect('/users');
    })
    .catch((error) => {
      console.log(error);
    })

});

router.get('/:userId', (req, res, next) => {
  var id = req.params.userId;
  User.findById(id)
  .then((user)=>{
    res.render('users/show', user);
  })
  .catch((err)=>{
    console.log(err);
  })
});

router.post('/:userId/delete', (req, res, next) => {
  var id = req.params.userId;
  console.log(id);
  User.findByIdAndRemove(id)
  .then((user)=>{
    res.redirect('/users');
  })
  .catch((err)=>{
    console.log(err);
  })
});

router.get('/:userId/delete', (req, res, next) => {
  var id = req.params.userId;
  console.log(id);
  User.findByIdAndRemove(id)
  .then((user)=>{
    res.redirect('/users');
  })
  .catch((err)=>{
    console.log(err);
  })
});

router.get('/:userId/edit', (req, res, next) => {
  var id = req.params.userId;
  User.findById(id)
  .then((user)=>{
    // res.json(user);
    res.render('users/edit', {user});
  })
  .catch(next)
});


router.post('/:id' , (req, res, next) =>{
  const {_id, username, name, surname, address, password, role } = req.body ;
  User.findByIdAndUpdate(_id, req.body , {new: true})
  .then((user)=>{
    res.redirect('/users');
  })
  .catch(next)
});

module.exports = router;