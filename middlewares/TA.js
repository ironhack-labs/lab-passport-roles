const TA = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.TA){
        console.log("WELCOME MY LORD TA");
        next();
    }else{
        console.log("You are a looser, not a TA!");
        res.redirect(redirectTo)
    }
}

module.exports = TA;