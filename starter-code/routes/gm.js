let router = require('express').Router()
let User = require('../models/User')

const isBoss = (req, res, next) => {
  if (!req.user) return res.redirect('/')
  if (req.user.role === 'BOSS') return next()
  req.logOut()
  return res.redirect('/')
}

router.get('/delete/:id', isBoss, (req, res, next) => {
  const {id} = req.params
  User.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/gm')
    })
    .catch(err => {
      req.app.locals.error = err
    })
})

router.post('/edit/:id', isBoss, (req, res, next) => {
  const {id} = req.params
  User.findByIdAndUpdate(id, {...req.body}, {new: true})
    .then(user => {
      console.log(user)
      res.redirect('/gm')
    })
    .catch(err => {
      req.app.locals.error = err
    })
})

router.get('/edit/:id', isBoss, (req, res, next) => {
  const {id} = req.params
  User.findById(id)
    .then(user => {
      const config = {
        title: 'Edit member',
        action: `/gm/edit/${id}`,
        submit: 'Update',
        name: user.name,
        email: user.email,
        password: 'hidden',
      }
      res.render('gm/signup', config)
    })
    .catch(err => {
      req.app.locals.error = err
    })
})

router.get('/signup', (req,res,next)=>{
  let config = {
    title: 'Add new member',
    action: '/gm/signup',
    submit: 'Create new',
    name: '',
    email: '',
    password: 'password',
  }
  res.render('gm/signup', config)
})

router.post('/signup', (req,res,next)=>{
  User.register(req.body, req.body.password)
  .then(()=>res.redirect('/gm'))
  .catch(e=>{
    req.app.locals.error = e
    res.redirect('/gm')
  })
})

router.get('/', (req,res,next)=>{
  User.find()
  .then(users => {
    res.render('gm/gm', {users})
  })
  .catch(err =>{
    req.app.locals.error = e
  })
})

module.exports = router