const isUser = (redirectTo, id) => (req, res, next) => {
  console.log(`ENTRA AL MIDDLEWARE ${id}`)
  if (req.user.id === id) {
    console.log("SAME USER");
    next();
  } else {
    console.log("DIFERENT USER");
    res.redirect(redirectTo);
  }
};

module.exports = isUser;
