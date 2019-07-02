const User = require("../models/User");

exports.getCreate = (req, res, next) => res.render("accounts/create", { user: req.user });

exports.postCreate = async (req, res, next) => {
	const { username, password, role, firstName, lastName, email } = req.body;
	await User.register(new User({ username, role, firstName, lastName, email }), password);
	res.redirect("/accounts/all");
};

exports.getAll = async (req, res, next) => {
	const {role} = req.user
	let accounts 
	if (role === 'STUDENT')	accounts = await User.find({ role });
	else accounts = await User.find({});
	res.render("accounts/all", { user: req.user, accounts });
};

exports.getAccount = async (req, res, next) => {
	const { id } = req.params;
	const account = await User.findById(id);
	res.render("accounts/account", { user: req.user, account });
};

exports.postAccount = async (req, res, next) => {
	const { id } = req.params;
	const { role, firstName, lastName, email } = req.body;
	await User.findByIdAndUpdate(id, { role, firstName, lastName, email });
	res.redirect("/accounts/all");
};

exports.getDelete = async (req, res, next) => {
	const { id } = req.params;
	await User.deleteOne({_id: id});
	if (req.user._id == id) res.redirect('/auth/logout')
	else res.redirect("/accounts/all");
};
