module.exports = {
  isBoss: (req, res, next) => {
    if(req.user && req.user.role == 'BOSS'){
      next();
    } else {
      res.redirect('/');
    }
  }
};
