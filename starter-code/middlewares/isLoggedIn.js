const isLoggedIn = (redirectURL, userID) => {
  return (req,res,next) => {
    // console.log('currentUser:', req.session.currentUser)
    // console.log('currentUser:', req.user.id)
      if (req.user.id) {
        next();
      } else {
        console.log("No puedes Pasar!!");
        res.redirect(redirectURL);
      }
  };
};


module.exports = isLoggedIn;
