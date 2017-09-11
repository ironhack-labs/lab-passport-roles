module.exports = {
  isBoss: (req, res, next) => {
    if(req.user && req.user.role == 'Boss') {
      next();
    } else {
      res.redirect('/');
    }
  }
};
