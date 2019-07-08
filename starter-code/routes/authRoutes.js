const passport = require('../middlewares/passport')
const {
    Router
} = require('express')
const router = Router()
const {
    getLogin,
    getSignup,
    logout,
    postSignup,
    postLogin
} = require('../controllers/authControllers')
router.get('/signup', getSignup)
router.post('/signup', postSignup)
router.get('/login', getLogin)
router.post('/login', passport.authenticate('local'), postLogin)
router.get('/logout', logout)

module.exports = router