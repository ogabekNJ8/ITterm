const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    refresh_token: { type: String },
    activation_link: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = model("User", userSchema);
