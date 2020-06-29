// const express = require('express')
// const router = express.Router()

// // Logged in checker middleware
// const checkAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login')

// // Role checker middleware
// const checkRole = rolesToCheck => (req, res, next) => req.isAuthenticated() && rolesToCheck.includes(req.user.role) ? next() : res.redirect('/login')

// // Alternativa para enviar a la vista en el renderizado
// // const checkAdmin = () => req.user.role.includes('BOSS')          // Alternativa
// // const checkUser = () => req.user.role.includes(['DEV', 'TA', 'STUDENT'])            // Alternativa
// // const checkGuest = () => req.user.role.includes('GUEST')          // Alternativa

// // const checkAdmin  = checkRole('BOSS');
// // const checkUser = checkRole(['DEV', 'TA', 'STUDENT']);
// // const checkGuest  = checkRole('GUEST');

// // Endpoints
// router.get('/', (req, res) => {
//     console.log('¿Está el usuario logeado?', req.isAuthenticated())
//     res.render('index')
// })


// // Check logged in session 
// router.get('/profile', checkAuthenticated, (req, res) => res.render('profile', { user: req.user }))


// // Check logged in session & roles
// router.get('/profile', checkRole(['STUDENT', 'TA', 'DEV', 'BOSS']), (req, res) => res.send('PROFILE normal'))
// router.get('/private', checkRole(['BOSS']), (req, res) => res.send('profile del boss'))



// module.exports = router
