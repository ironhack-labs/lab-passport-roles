
const express = require("express")
const router = express.Router()
const passport = require("passport")
const Course = require("../models/Course.model")

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })


//Crear un curso


router.get('/courses/create',checkRole(['TA']),(req,res,next)=>res.render('courses/create'))

router.post('/courses/create',checkRole(['TA']),(req,res,next)=>{
    const {title,leadTeacher,startDate,endDate,ta,courseImg,description,status,students} = req.body

    // res.send({title,leadTeacher,startDate,endDate,ta,courseImg,description,status,students})
    Course.create({title,leadTeacher,startDate,endDate,ta,courseImg,description,status,students})
    .then(() => res.redirect('/courses/list'))
    .catch(error => next(error))
})


//Listar los cursos

router.get('/courses/list',checkLoggedIn,(req,res,next)=>{
    
    Course.find({})
    .then(courses=>res.render('courses/list',{courses}))
    .catch(err=>next(err))
    })



//borrar cursos
 router.get('/courses/:_id/delete',checkRole(['TA']),(req,res,next)=>{
    const id=req.params._id
    Course.findByIdAndRemove(id)
    .then(() => res.redirect('/courses/list'))
    .catch(err=>next(err))
    
    })   


//editar los cursos

router.get('/courses/edit/:id',checkRole(['TA']),(req,res,next)=>{ 
    const id= req.params.id

    Course.findById(id)
    .then(courseEdit=>res.render('./courses/edit',courseEdit))
    .catch(err=>next(err))     

    })




router.post('/courses/:id',checkRole(['TA']),(req,res,next)=>{

    const id = req.params.id    
    const {title,leadTeacher,startDate,endDate,ta,courseImg,description,status,students} = req.body
    Course.findByIdAndUpdate(id,{title,leadTeacher,startDate,endDate,ta,courseImg,description,status,students})
        .then(()=>res.redirect('/'))
        .then(()=>res.render("<h3>Curso modificado</h3>"))
        .catch(err=>next(err))
    
    
        })


module.exports = router