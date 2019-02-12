const router = require('express').Router()
const User = require('../models/User')

const isBoss = (req, res, next) => {
  if(!req.user) return res.redirect('/')
  if (req.user.role === 'GM') return next()
  req.logOut()
  return res.redirect('/')
}

// Logout
router.get('/logout', (req, res, next) => {
  req.logOut()
  return res.redirect('/')
})

// Delete
router.get('/delete/:id', isBoss, (req, res, next) => {
  const { id } = req.params
  User.findByIdAndDelete(id)
    .then(()=> res.redirect('/gm'))
    .catch(e=> next(e))
})

// Edit

router.post('/edit/:id', isBoss, (req, res, next) => {
  const {id} = req.params
  User.findByIdAndUpdate(id, { ...req.body }, { new: true })
    .then(() => {
      res.redirect('/gm')
    })
  .catch(e=> next(e))
})
router.get('/edit/:id', isBoss, (req, res, next) => {
  const { id } = req.params
  User.findById(id)
    .then(user => {
  const config = {
    title: 'Edit ' + user.name,
    action: `/gm/edit/${id}`,
    submit: 'Update',
    name: user.name,
    email: user.email,
  }
  res.render('gm/new', isBoss, config)
    })
  .catch(e=> next(e))
})

// Add new
router.post('/new', isBoss, (req, res, next) => {
  User.register({ ...req.body }, req.body.password)
    .then(user => {
      res.redirect('/gm')
    })
    .catch(e => next(e))
});

router.get('/new', isBoss, (req, res, next) => {
  const config = {
    title: 'Add new member',
    action: '/gm/new',
    submit: 'Create new',
    name: '',
    email: '',
  }
  res.render('gm/new', config)
});

// List
router.get('/', isBoss, (req, res, next) => {
  User.find()
    .then(users => {
      res.render('gm/gm', {users})  
  })
    .catch(e=> next(e))
})

module.exports = router
