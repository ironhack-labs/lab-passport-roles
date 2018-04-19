const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    //schema fieds
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["Boss", "Developer", "TA"],
      default: "Developer"
    },

    //normal sign up & login
    encryptedPassword: { type: String }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("isBoss").get(function() {
  return this.role === "Boss";
});

const User = mongoose.model("User", userSchema);

module.exports = User;
