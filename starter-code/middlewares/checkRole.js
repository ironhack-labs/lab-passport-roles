module.exports = (role, checkUser) => {	
	return (req, res, next) => {
		const { id } = req.params;
		if (req.user && (req.user.role === role || (checkUser && id && req.user._id == id))) next();
		else res.redirect("/auth/login");
	};
};
