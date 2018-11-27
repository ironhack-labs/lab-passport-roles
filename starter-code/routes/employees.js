const express = require('express');
const router = require("express").Router();
const User = require("../models/User");


function checkIfIs(role){
  return function(req, res, next) {
    if(req.user.role === role || req.user.role("BOSS")) return next();
    return res.send({message: `No tienes permiso, no eres un ${role}`})
  }
}

function isAuth(req, res, next) {
  if(req.isAuthenticated()) return next();
  return res.redirect("/auth/login");
}

function canAddEmployee(req, res, next){
  if(req.user.role === "BOSS") return next()
  return res.redirect("/posts");
}

function canDeleteEmployee(req, res, next) {
  if(req.user.role === "BOSS") return next()
}

router.post('/modify/save/:id', (req,res,next)=>{
  //res.send(req.params.name)
  User.updateOne({'_id':req.params.id},{'name':req.body.name,
                                        'email':req.body.email})
  .then(resultUpdate => {
    //res.json(resultUpdate);
    res.redirect("/employees");
  })
  .catch(err =>{
    res.send(err)
  });

})

router.get('/modify/:id', (req,res,next)=>{
User.find({'_id':{'$eq':req.params.id}})
.then(employee => {
  //res.json(employee[0]);
  res.render('employees/modify', employee[0])
})
.catch(e => next(e));
})


router.get('/delete/:id', (req,res,next)=>{
  User.deleteOne({'_id':req.params.id})
  .then(employee => {
    //res.json(employee);
    res.redirect("/employees");
  })
  .catch(e => next(e));
  })

router.post('/new', isAuth, checkIfIs('BOSS'), (req,res,next) => {
  User.register(req.body, req.body.password)    
  .then(employee => {
    //res.json(employee);
    res.redirect("/employees");
  })
  .catch(e => next(e));
  })

router.get('/new', isAuth, checkIfIs('BOSS'), (req,res, next) => {
  res.render('employees/new');
})


router.get('/', isAuth, checkIfIs("BOSS"), canDeleteEmployee, (req, res, next) => {
  User.find({'role':{'$ne':'BOSS'}}).then(employees => {
    res.render('employees/list', {employees})
  })
})




module.exports = router;