const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Acct = require("../models/Acct");

// Get All Acct User
router.get("/acct", (req, res) => {
  Acct.find()
    .then((data) => {
      res.send({ success: true, message: "All Acct User", data: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

// Get Single Acct User
router.get("/acct/:id", (req, res) => {
  const id = req.params.id;
  Acct.findOne({ _id: id })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("No Acct User Found");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

// Add New Acct User
router.post("/acct", (req, res) => {
  console.log(req.body);
  //   const title = req.body.title;
  //   const description = req.body.description;
  //   const duration = req.body.duration;
  //   const price = req.body.price;
  const { email, password, author, gender, mobile } = req.body;

  // Create a Course Object
  const newAcct = new Acct({
    email,
    password,
    author,
    gender,
    mobile,
  });

  // Save Course in Database
  // Save Note in the database
  newAcct
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

// Edit Single Course
router.put("/acct/:id", (req, res) => {
  const id = req.params.id;
  Acct.findOneAndUpdate({ _id: id }, req.body)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("No Data Found");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

// Delete Single Course
router.delete("/acct/:id", (req, res) => {
  const id = req.params.id;
  Acct.findOneAndDelete({ _id: id })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("No Data Found");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
});

module.exports = router;
