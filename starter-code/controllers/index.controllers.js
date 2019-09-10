const User = require("./../models/User");

exports.getLoginForm = async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/profile");
  const options = {
    action: "/login",
    title: "Log in"
  };
  res.render("auth/form", options);
};

exports.getEmployeeSignUpForm = async (req, res) => {
  const options = {
    action: "/employees/signup",
    title: "Sign up",
    isSignup: true,
    isBoss: true
  };
  res.render("auth/form", options);
};

exports.getProfile = async (req, res) => {
  const isEmployee =
    req.user.role === "BOSS" ||
    req.user.role === "DEVELOPER" ||
    req.user.role === "TA";

  res.render("auth/profile", { user: req.user, isEmployee });
};

exports.logInUser = (req, res) => {
  res.redirect("/profile");
};

exports.createEmployee = async (req, res) => {
  const { email, firstName, lastName, age, role, password } = req.body;
  await User.register({ email, firstName, lastName, age, role }, password);
  res.redirect("/employees");
};

exports.getAllEmployees = async (req, res) => {
  const employees = await User.find({
    $or: [{ role: "BOSS" }, { role: "DEVELOPER" }, { role: "TA" }]
  });
  const isBoss = req.user.role === "BOSS";

  res.render("employees/index", { employees, isBoss });
};

exports.getEmployee = async (req, res) => {
  const employee = await User.findById(req.params.id);
  res.render("auth/profile", { user: employee });
};

exports.editEmployeeForm = (req, res) => {
  const options = {
    action: "/profile/edit",
    title: "Edit",
    isSignup: true,
    user: req.user
  };
  res.render("auth/form", options);
};

exports.editEmployee = async (req, res) => {
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

exports.getStudentSignUpForm = async (req, res) => {
  const options = {
    action: "/students/signup",
    title: "Sign up",
    isSignup: true
  };
  res.render("auth/form", options);
};

exports.createStudent = async (req, res) => {
  const { email, firstName, lastName, age, password } = req.body;
  await User.register({ email, firstName, lastName, age }, password);
  res.redirect("/profile");
};

exports.getAllStudents = async (req, res) => {
  const employees = await User.find({ role: "STUDENT" });

  res.render("employees/index", { employees });
};
