const { model, Schema } = require("mongoose");
const plm = require("passport-local-mongoose");
const UserSchema = new Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ["BOSS", "DEVELOPER", "TA"],
      default: "TA"
    }
  },
  {
    timestamps: true,
    versionkey: false
  }
);

UserSchema.plugin(plm, { usernameField: "username" });

module.exports = model("User", UserSchema);
