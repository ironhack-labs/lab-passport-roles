const expres = require('express')
const router = expres.Router()



function checkActions(role){
  return (req,res,next)=> req.user.role === 'BOSS' ? next() : res.send(' no puedes hacer esto')  
}


router.get('/',(req,res, next)=>{
  res.render('school/profile')
})

/* Rutas para crear  */
router.get('/new',checkActions('BOSS'), (req,res, next)=>{
  res.render('school/new')
})

router.post('/new',checkActions('BOSS'),(req,res, next)=>{
  res.render('school/new')
})

/* Rutas para eliminar */

router.get('/delete/:id',checkActions('BOSS'),(req,res)=>{
  res.render('school/delete')
})


/* Listar recursos */



module.exports = router