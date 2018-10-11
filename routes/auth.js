const
  express    = require(`express`),
  authRoutes = express.Router(),
  User       = require(`../../models/User`),
  passport   = require(`passport`)
;
 authRoutes.get( `/signup`, (req,res) => res.render(`auth/authView`, {signup:true}) );
 authRoutes.post(`/signup`, (req,res) => {
  const
    password = req.body.password,
    {username, role} = req.body
  ;
  User
    .register({username, role}, password)
    .then(() => res.redirect(`/auth/login`) )
  ;
});
 authRoutes.get( `/login`, (req,res) => res.render(`auth/authView`, {login:true}) );
 authRoutes.post(`/login`, passport.authenticate(`local`), (req,res) => res.redirect(`/admin`) );
 authRoutes.post(`/logout`, (req,res) => {
  req.logout();
  res.redirect(`/auth/login`);
});
 authRoutes.post(`/admin/create`, (req,res) => {
  const
    password = req.body.password,
    {username, role} = req.body
  ;
  User
    .register({username, role}, password)
    .then(() => res.redirect(`/admin`))
  ;
});
 module.exports = authRoutes;