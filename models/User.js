const
  mongoose = require(`mongoose`),
  Schema = mongoose.Schema,
  pLM = require(`passport-local-mongoose`),

  userSchema = new Schema({
    username: String,
    hash: String,
    role: {
      type: String,
      enum: [`boss`, `dev`, `ta`, `alum`],
      default: `ta`
    }
  },{
    timestamps: {
      createdAt: `created_at`,
      updatedAt: `updated_at`
    }
  })
;

userSchema.plugin(pLM);

module.exports = mongoose.model(`User`, userSchema);