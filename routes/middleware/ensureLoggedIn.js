const ensureLoggedIn = (redirectTo) => {
  return (req, res, next) => {
      if(req.user){
          next();
      }else{
          req.flash('error','You have to login first');
          res.redirect(redirectTo);
      }
  }
}

const ensureLoggedOut = (redirectTo) => {
  return (req, res, next) => {
      if(!req.user){
          next();
      }else{
          req.flash('error','You are logged in, cannot access');

          res.redirect(redirectTo);
      }
  }
}

const isBoss =  (req, res, next) => {
      if(req.user.role[0] == "Boss"){
          next();
      }else{
          req.flash('error','You are not the Boss');
          res.redirect("/auth/userlistedit");
      }
  }

const hasRole = (role) => {
  return (req, res, next) => {
      if(req.user.role.includes(role)){
          next();
      }else{
          req.flash('error',`You do not have the role ${role}`);
          console.log("Estoy dentro del hasRole")
          res.redirect('/auth/userlistedit');
      }
  }
}

module.exports = {
  ensureLoggedIn,
  ensureLoggedOut,
  isBoss, 
  hasRole
}


