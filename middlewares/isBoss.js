

const isBoss = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.role == "Boss"){
        next();
    }else{
        console.log("You are a looser, not an boss");
        res.redirect(redirectTo)
    }
}

module.exports = isBoss;