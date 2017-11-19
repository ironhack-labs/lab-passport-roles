const express =require ("express");
const router=express.Router();
const passport =require ("passport");
const moment =require('moment');
const {ensureLoggedIn, ensureLoggedOut}= require('connect-ensure-login');
const Course= require('../models/Course');
const User=require('../models/User');
const checkRoles=require('../middleware/checkRol');


router.get('/addCourse',checkRoles("TA"), (req,res,next)=>{
  res.render('courses/addCourse');
});

router.get('/modifyCourse', checkRoles("TA"),(req,res,next)=>{
  Course.find()
    .then(items =>{res.render('courses/modifyCourse', {items});})
    .catch(err=>{ res.render('private/private-main', {errorMessage: err.message});
    });
});

router.get('/addAlumni', checkRoles("TA"), (req, res, next)=>{
  User.find({'role':{$eq:'STUDENT'}})
  .then(items =>{
    res.render('courses/addAlumni',{items});
  })
  .catch(e =>{
    return res.render('course', {errorMessage: e.message});
  });
});


router.get('/:id/addAlumni', (req,res,next)=>{
  // implementar
});

router.post('/addCourse',checkRoles("TA"), (req,res,next)=>{

  const courseInfo ={
     name: req.body.name,
     startingDate: req.body.startingDate,
     endDate: req.body.endDate,
     level: req.body.level,
     available: req.body.available
   };
  const newCourse =new Course (courseInfo);
  newCourse.save()
    .then(()=>{res.redirect('/private');})
    .catch(err=>{ res.render('private/private-main', {errorMessage: err.message});
  });
});

router.get('/:id/editCourse', checkRoles("TA"), (req,res,next)=>{
  const id=req.params.id;
  Course.findById(id)
    .then((item)=> { res.render('courses/editCourse', {item});})
    .catch(err=>{ res.render('private/private-main',{errorMessage: err.message});
  });
});

router.post('/:id/editCourse',checkRoles("TA"),(req,res,next)=>{
  let id = req.params.id;

  const updates = {
    name: req.body.name,
    startingDate: req.body.startingDate,
    endDate:req.body.endDate,
    level:req.body.level,
    available:req.body.available
  };

  Course.findByIdAndUpdate(id, updates, (err, item) => {
    if (err){ return next(err); }
    return res.redirect('/private');
  });
});

router.post('/:id/deleteCourse', checkRoles("TA"), (req,res,next)=>{
  let id=req.params.id;
  Course.findByIdAndRemove(id, (err, item) => {
    if (err){ return next(err); }
    return res.redirect('/private');
  });
});

module.exports =router;
