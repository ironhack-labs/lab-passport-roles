const express = require('express')
const router = express.Router()
const User = require('../models/User')

//Ironhack

function checkRole(){
 return (req, res, next)=>{
   if(req.isAuthenticated()){
       if(req.user.role === 'BOSS'){
            res.render('ironhack/manager')
        } 
        else if(req.user.role === 'TA'){
            res.render('ironhack/cursos')
        }
        else{
            res.render('')
        }
    }
   else{
     res.redirect('/login')
   }
 }
}


//lista
router.get('/', checkRole(), (req, res, next)=>{
//res.render('ironhack/manager')
})

router.get('/', checkRole(), (req, res, next)=>{
  //res.render('ironhack/cursos')
})

router.get('/users',(req,res,next) => {
    User.find()
    .then(users=>{
        res.render('ironhack/usuarios-list',{users})
    }).catch(e=>{
        console.log(e)
        next(e)
    })
})

//Detalle
router.get('/show/:id',(req,res,next)=>{
    const {id} = req.params
    User.findById(id)
    .then(users=>{
      res.render('ironhack/usuarios-detail',users)
    })
    .catch(e=>{
      console.log(e)
      next(e)
    })
  })

  //Borrar 
router.get('/delete/:id',(req,res,next)=>{
    const {id}=req.params
    User.findByIdAndRemove(id)
    .then(users=>{
      res.redirect('/ironhack/users')
    }).catch(e=>next(e))
  })


module.exports = router