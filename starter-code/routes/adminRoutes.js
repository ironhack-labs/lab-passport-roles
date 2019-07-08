const {
    Router
} = require('express')
const router = Router()
const {
    findUsers,
    deleteUser
} = require('../controllers/adminControllers')

router.get('/ironhack', findUsers)
router.get('/ironhack/:id/delete', deleteUser)

module.exports = router