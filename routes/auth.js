const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Acct = require("../models/Acct");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");

//Acct Reg with OTP and Hash Password
router.post("/auth/register", (req, res) => {
  //console.log(req.body);
  const { email, password, name, gender, mobile } = req.body;
  // Create OTP Code
  const otpCode = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
    digits: true,
  });
  // Hash Password
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  // Create New User Object
  const newAcct = new Acct({
    email: email,
    password: hash,
    name: name,
    gender: gender,
    mobile: mobile,
    otp: otpCode,
  });
  // Save User
  newAcct
    .save()
    .then((data) => {
      res.send({ success: true, message: "New Acct User Created", data: data });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Some error occurred",
      });
    });
});

//Verify Acct User using phone number
router.post("/auth/verify", (req, res) => {
  //console.log(req.body);
  const { mobile, otp } = req.body;
  Acct.findOne({ mobile: mobile, otp: otp })
    .then((data) => {
      if (data) {
        // User Exists
        // Credentials are correct
        data.updateOne({ otp: null, verified: true }).then((data2) => {
          res.send({
            success: true,
            message: "User has been verified",
            data: data,
          });
        });
      } else {
        // User does not exist
        // Invalid Credentials
        res.send({
          success: false,
          message: "Incorrect Credentials",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Some error occurred",
      });
    });
});

//Login using phone verification
router.post("/auth/login", (req, res) => {
  const { mobile, password } = req.body;
  const hash = Acct.findOne({ mobile: mobile })
    .then((data) => {
      if (data) {
        // User Exists
        // Compare Password with Hash
        console.log(data);
        bcrypt.compare(password, data.password, function (err, isValid) {
          if (isValid === true) {
            // Password is correct
            res.send({
              success: true,
              message: "Password is Correct",
              data: data,
            });
          } else {
            // Invalid Password
            console.log(err);
            res.status(400).send({
              success: false,
              message: "Invalid Password",
            });
          }
        });
      } else {
        // User does not exist
        res.status(404).send({
          success: false,
          message: "User does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Some error occurred",
      });
    });
});

module.exports = router;
