const express = require('express');
const router = express.Router();
const modelUser = require('../models/roles')
const modelCourses = require('../models/courses')

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

const checkTA  = checkRoles('TA');
const checkDeveloper = checkRoles('Developer');
const checkBoss  = checkRoles('Boss');


router.get('/edit-course/:id', (req,res,next)=>{

  const id = req.params.id


  modelCourses.findById(id)
  .then((data)=>{
    res.render('edit-course',{data})
  })

})


router.get("/eliminate-course/:id", checkTA, (req, res) => {

 
  const id = req.params.id
  console.log("asdf")
  console.log(id)
 
  modelCourses.findByIdAndDelete(id)
  .then(()=>{
    console.log("Eliminado con exito")
    res.redirect('/create-course')
  })


});


router.post('/edit-course',(req,res,next)=>{

  const id = req.body.id
  const name = req.body.name
  const description = req.body.description
  
    modelCourses.findByIdAndUpdate(id,{name: name, description: description})
    .then(()=>{
      console.log("Modificado con exito")
      res.redirect('/create-course')
    })  
  })

  router.get('/delete/:id',(req,res,next)=>{

    const id = req.params.id
    console.log(id)
    modelUser.findByIdAndDelete(id)
    .then(()=>{
      const message = "Borrado con exito"
      res.render('boss',{message})
    })
      
  })
  
  
  router.get('/edit/:id',(req,res,next)=>{
  
    const id = req.params.id
  
    modelUser.findById(id)
    .then((data)=>{
  
      res.render('../views/edit',{data})
    })
      
  })


  router.post('/edit', (req,res,next)=>{

    const id = req.body.id
    const username = req.body.username
  
    modelUser.findByIdAndUpdate(id,{username: username})
    .then(()=>{
      console.log("Modificado con exito")
    })
  
  })



module.exports = router;