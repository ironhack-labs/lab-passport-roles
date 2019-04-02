const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const passport = require("passport");

// middleweres
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/login')
  }
};

function ensurelevel(req,res,next){
  let role = undefined;
  var validarol=function(){
    if(req.user == undefined) {return}
    else {return role = req.user.role}
  };
  validarol();
  if (role == 'BOSS'|| role == 'TA'){return next()}
  else{ res.redirect('/private')}  
}

// Termina Middlewares

//Para el acceso a crear cursos:
router.get("/new",ensureAuthenticated,ensurelevel, (req, res) => {
  res.render("newcourse");
});
// para el guardado de un nuevo curso:
router.post("/new",(req,res)=>{
  Course.create(req.body)
  .then(()=>{
  res.redirect("../private")})
  .catch(err=>{
      console.log(err)
  })
  });

//Para ver los cursos existentes:
  router.get("/",ensureAuthenticated,(req,res)=>{
    Course.find()
.then(courses =>{
  res.render("courses", {courses});
})
.catch(err=>{
  console.log(err);
})
});

// Para ver el detalle de los cursos:

router.get("/detail/:id",ensureAuthenticated,(req,res)=>{
  const {id} = req.params;
  Course.findById(id)
.then((course) =>{

  var rol = req.user.role;
  var func = function(){
  if(rol === 'BOSS'){return {boss: true ,ta:false, course }}
  if(rol === 'TA'){return {boss:false,ta: true ,course }}
  else{return {boss: false ,ta:false,course }}
}; 
var data =func();
  console.log(data);
  return res.render("detailcourses", data);

})
.catch(err=>{
console.log(err);
})
});

// Para la ediciòn de un registro:

router.get("/:id/edit",ensureAuthenticated,ensurelevel,(req,res) =>{
  const {id} = req.params;
   Course.findById(id)
   .then(course=>{ 
     console.log(req.params);
     res.render("newcourse",course);
   })
 });

// Para guardar la ediciòn:

router.post("/:id/edit",(req,res) =>{
  const {id} = req.params;
   Course.findByIdAndUpdate(id,{$set:{...req.body}}) 
   .then(course =>{
     console.log(course)
     res.redirect('/course')
   })
 });

 // Para el borrado:

 router.post("/detail/:id",(req,res)=>{
  const {id} = req.params;
  console.log(id);
  Course.findByIdAndDelete(id)
  .then(course =>{
      console.log(course)
      res.redirect('/course')
    })
});



  module.exports = router;