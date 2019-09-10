const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const {getProfile, createEmployee, allUsers, updateFormEmployee, updateEmployee} = require('../controllers/index-controller')
const passport = require('../config/passport')

/* GET home page */
router.get('/', (req,res) => {res.redirect('/login')})

//signup get and post
router.get('/signup', (req,res) => {
  const config = {
    title: 'Sign up',
    action: '/signup',
    button: 'Sign up',
    register:true
  }
  res.render('form', config)
})

router.post('/signup',async (req,res,next) => {
  try{
  const user =await User.register({...req.body}, req.body.password)
  console.log(user)
  res.redirect('login')
  }
  catch(e) {
    console.log(e)
    res.send('Este usuario ya existe')
  }
})
//Login get and post
router.get('/login', (req,res) => {
  const config = {
    title: 'Log in',
    action: '/login',
    button: 'Login',

  }
  res.render('form', config)
})
router.post('/login', passport.authenticate('local'), (req,res) => {
  res.redirect('/profile')
})

//profile page

router.get('/profile', getProfile)

//create-employees page
router.get('/create-employee', (req,res) => {res.render('create-employee')})
router.post('/create-employee',async (req,res,next) => {
  try{
  const user =await User.register({...req.body}, req.body.password)
  res.redirect('/profile')
  }
  catch(e) {
    console.log(e)
    res.send('Este usuario ya existe')
  }
})

//users page
router.get('/users', allUsers)

//edit-profile
router.get('/edit-profile', updateFormEmployee)
router.post('/edit-profile', updateEmployee)

module.exports = router;
