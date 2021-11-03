const mongoose = require("mongoose");

const acctSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    name: String,
    gender: String,
    mobile: Number,
    otp: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Acct", acctSchema);
