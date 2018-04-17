const isBoss = redirectTo => (req, res, next) => {
  console.log( " COMPRUEBO SI ES BOSS")
  if (req.user && req.user.rol === "Boss") {
    console.log("WELCOME BOSS");
    next();
  } else {
    console.log("You are not THE BOSS");
    res.redirect(redirectTo);
  }
};

module.exports = isBoss;
