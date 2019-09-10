const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password);
    console.log(user);
    res.redirect('/user');
  } catch (e) {
    console.log(e);
    res.send('User already exists');
  }
};

exports.getUsers = async(req, res) => {
  const users = await User.find();
  console.log(users);
  res.render('../views/user/index', {users});
};

exports.getCurrentUser = async(req, res) => {
  const [user] = await User.find({_id: req.user._id});
  console.log('Current user', user);
  res.render('../views/user/profile', {user, canUpdate: true});
};

exports.getUser = async(req, res) => {
  const [user] = await User.find({_id: req.params.id});
  console.log('Selected user', user, req.params);
  const canUpdate = req.params.id === req.user._id.toString() || req.user.role === 'Boss';
  res.render('../views/user/profile', {user, canUpdate});
};


exports.updateUser = async(req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body);
  console.log(user);
  res.redirect(`/user/profile/${req.params.id}`);
};

