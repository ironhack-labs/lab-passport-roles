const checkRoles = (role) => {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}


const checkDev = checkRoles('DEV');
const checkTA = checkRoles('TA');
const checkBoss = checkRoles('BOSS');

module.exports = {
  checkRoles,
  checkBoss,
  checkTA,
  checkDev
}