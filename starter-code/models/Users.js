const { model, Schema } = require("mongoose");
const plm = require("passport-local-mongoose");
const userSchema = new Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ["BOSS", "DEVELOPER", "TA"],
      default: "DEVELOPER"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);
userSchema.plugin(plm, { usernameField: "username" });
module.exports = model("User", userSchema);
