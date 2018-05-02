const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const profileSchema = Schema({
  firstName: String,
  lastName: String,
  title: String,
  owner: Schema.Types.ObjectId
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;