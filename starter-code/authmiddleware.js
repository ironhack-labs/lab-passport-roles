module.exports = {
  isBoss: function(req, res, next) {
    console.log(req.user, 'Imprimo req.user');
    if(!req.user) {
      return res.redirect('/login');
    } else if(req.user.role !== 'Boss') {
      res.render('error', {msg: 'No puedes entrar, no eres el Boss', goTo: '/'});
    }
    next();
  },  
  isDeveloper: function() {

  },
  isTa: function() {

  },
}