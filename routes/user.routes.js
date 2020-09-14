const express = require('express')
const User = require('../models/user.model')
const router = express.Router()

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { message: 'Desautorizado, incia sesión para continuar' })
const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.render('auth/login', { message: 'Desautorizado, no tienes permisos para ver eso.' })


router.get('/profile',(req,res,next)=>res.render('profile'))


//Listar Usuarios
router.get('/list',checkLoggedIn,(req,res,next)=>{
    
    
User.find({})
.then(users=>res.render('./users/list',{users}))
.catch(err=>next(err))
})

//editar usuario propio

router.get('/edit',checkLoggedIn,(req,res,next)=>{ 
    // id= req.sessionID
    const id=req.user._id
    User.findById(id)
   .then(user=>res.render('./users/edit',user))
   .catch(err=>next(err))

    })


//Perfil de cada usuario

router.get('/:id',checkLoggedIn,(req,res,next)=>{
const id=req.params.id
User.findById(id)
.then(user=>res.render('./users/profile',user))
.catch(err=>next(err))


})




//Delete 
router.get('/:_id/delete',checkRole(['BOSS']),(req,res,next)=>{
    const id=req.params._id
    User.findByIdAndRemove(id)
    .then(() => res.redirect('/list'))
    .catch(err=>next(err))
    
    })




//Editar usuarios

router.get('/:id/edit',checkRole(['BOSS']),(req,res,next)=>{ 
    const id= req.params.id

    User.findById(id)
    .then(userEdit=>res.render('./users/edit',userEdit))
    .catch(err=>next(err))     

    })




router.post('/:id',checkRole(['BOSS']), (req,res,next)=>{

    const id = req.params.id    
    const { username,name,password: hashPass,profileImg,description,facebookId,role, } = req.body
    
        User.findByIdAndUpdate(id,{ username,name,password: hashPass,profileImg,description,facebookId,role, })
        .then(()=>res.redirect('/list'))
        .catch(err=>next(err))
    
    
        })


module.exports = router








