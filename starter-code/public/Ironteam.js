const mongoose = require("mongoose");
const User           = require("/home/manuel/ironhack/semaine5/jour1/lab-passport-roles/starter-code/model/user");

var Gonzalo = User({
  name: 'Gonzalo',
  password: 'Gonzalo',
  role: 'BOSS'
});

var Lluis = User({
  name: 'Lluis',
  password: 'Lluis',
  role: 'DEVELOPPER'
});

var Alfonso = User({
  name: 'Alfonso',
  password: 'Alfonso',
  role: 'TA'
});


Gonzalo.save();
Lluis.save();
Alfonso.save();
