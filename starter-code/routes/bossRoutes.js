const {
  Router
} = require('express')
const router = Router()

router.get('/team', (req, res) => {
  res.render('team')
})

module.exports = router