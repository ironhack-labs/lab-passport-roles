const router = require("express").Router()
const bcrypt = require('bcrypt')

const User = require('./../models/user.model')

//Registro
router.get('/sign-up', (req, res) => {

    res.render("./../views/auth/sign-up")
    // res.send("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    // res.render('auth/sign-up')

})

router.post('/sign-up', (req, res) => {

    const { username, pwd } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (user) {
                res.render('auth/sign-up', { errorMessage: 'Usuario ya registrado' })
                return
            }

            const bcryptSalt = 10
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(pwd, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
})

//login

router.get('/sign-in', (req, res) => res.render('./../views/auth/sign-in'))

router.post('/sign-in', (req, res) => {

    const { username, pwd } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/sign-in', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (bcrypt.compareSync(pwd, user.password) === false) {
                res.render('auth/sign-in', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user
            console.log('Este es el objeto de sesión:', req.session)
            res.redirect('/')
        })
        .catch(err => console.log(err))
})



router.get('/disconnect', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})
module.exports = router
