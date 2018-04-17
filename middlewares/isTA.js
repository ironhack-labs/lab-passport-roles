
const isTA = (redirectTo) => (req, res, next) => {
  if (req.user && (req.user.rol.ta || req.user.rol.boss) ) {
    console.log(`ACCESS GRANTED to TA ${req.user.username}`);
    next();
  } else {
    console.log(`ACCESS DENIED. No TA, redirect!`);
    res.redirect(redirectTo);
  }
};



module.exports = isTA;