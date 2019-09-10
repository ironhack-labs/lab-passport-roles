module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('authenticat')
    next()
  } else {
    res.redirect('/login')
    console.log('no authenticat')
  }
}