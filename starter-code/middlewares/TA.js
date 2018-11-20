const TA = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.TA){
        console.log("WELCOME TA");
        next();
    }else{
        console.log("something wrong");
        res.redirect(redirectTo)
    }
}

module.exports = TA;