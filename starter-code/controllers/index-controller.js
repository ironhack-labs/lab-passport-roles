const User = require('../models/User')

exports.getProfile = (req,res) => {
  const user = req.user
  console.log(user.role)
  if(user.role === 'BOSS') {
    const config = {
      isBoss: true
    }
    res.render('profile', {user, config})
  }else {
    res.render('profile', {user})
  }
}


exports.allUsers = async(req,res) => {
  const users = await User.find()
  res.render('users', {users})
}


exports.updateFormEmployee = (req,res,next) => {
  {
    const options = {
      action: "/profile/edit",
      title: "Edit",
      isSignup: true,
      user: req.user
    };
    res.render("edit-profile", options);
  };
  
}
  
exports.updateEmployee = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { email, firstName, lastName, age, password } = req.body;
  await user.setPassword(password);
  await user.save();
  await User.findByIdAndUpdate(req.user.id, {
    email,
    firstName,
    lastName,
    age
  });
  res.redirect("/profile");
};