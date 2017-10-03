class Snip {
	constructor() {
		this.BOSS = 3;
		this.DEV = 2;
		this.NOBODY = 1;
		this.strategy = '';
		this.errorMessage = '<% if (typeof(errorMessage) != "undefined") { % > < div class = "error-message" > <%= errorMessage %> < /div><% } %>';
		this.adminButton = '<div><a href="/admin"> <button class="btn btn-danger">ADMIN PANEL</button></a></div>'
	}
	check(role) {
		return (req, res, next) => {
			if (req.isAuthenticated() && this[req.user.role] >= role) {
				return next();
			} else {
				res.sendStatus(401, '/unauthorized')
			}
		}
	}

	roleParser(role) {
		console.log(this)
		return Object.entries(this).filter((el, i) => el[1] === parseInt(role))[0][0];
	}

	serializeUser(user, cb) {
		cb(null, user._id);
	};

	deserializeUser(id, cb) {
		User.findOne({ "_id": id }, (err, user) => {
			if (err) { return cb(err); }
			cb(null, user);
		});
	};
}

module.exports = new Snip()