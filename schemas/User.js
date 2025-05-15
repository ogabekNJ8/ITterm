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
      default: true,
    },
    refresh_token: { type: String },
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "updated_date",
    },
  }
);

module.exports = model("User", userSchema);
