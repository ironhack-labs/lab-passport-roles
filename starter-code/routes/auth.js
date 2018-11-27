const express = require('express');
const router  = express.Router();
const User = require('../models/User')
const passport = require('passport')

function isRole(role){
  return function(request, response, next){
    if(role === request.user.role){
      return next()
    }
    return response.redirect('/login')
  }
}

//Para crear un jefe
router.get('/createB', (req,res,next)=>{
  res.render('auth/createB')
})

router.post('/createB', (req,res,next)=>{
  User.create(req.body)
  .then(user=>{
    res.redirect('/auth/employees')
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/delete/:id', isRole('BOSS'), (request,response, nextx)=>{
  const {id} = request.params
  User.findByIdAndDelete(id)
  .then(response=>{
    response.redirect('/auth/employees')
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/edit', (req, res, next)=>{
  const user = req.userres.render('auth/edit', user)
})

router.post('/edit', (re, res, next)=>{
  const {username} = req.body
  User.findOneAndUpdate({$set:{username}})
  .then(user=>{
    //duda
    res.redirect('employees/list')
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/login', (req,res,next)=>{
  res.render('auth/login')
})

router.post('/login', passport.authenticate('local'), (req, res, next)=>{
  req.app.locals.user = req.user
  const email = req.user.email
  User.findOne({email})
  .then(user=>{
    res.send(`Listo ${user.username}`)
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/signup', isRole("BOSS"), (req,res,next)=>{
  res.render('auth/signup')
})

router.post('/signup', (req,res,next)=>{
  User.register(res.body, req.body.password)
  .then( user => {
    //duda
    res.redirect('employees/list')
  })
})

//Lista
router.get('/employees', (req,res,next)=>{
  User.find()
  .then(users=>{
    const myUser = req.user.role === "BOSS"
    res.render('employees/list', {users, myUser})
  })
  .catch(e=>{
    next(e)
  })
})

router.get('/logout', (req,res,next)=>{
  req.logOut()
  res.redirect('/login')
})

module.exports = router
