const mongoose = require("mongoose");
const Roles = require("../models/user");

const dbRoles = "Roles";
mongoose.connect(`mongodb://localhost/${dbRoles}`);

const roles = [
  {
    name: "Miguel",
    role: "BOSS"
  }
];

Roles.create(roles, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${roles.length} roles`);
  mongoose.connection.close();
});
