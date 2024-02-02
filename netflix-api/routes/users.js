const router = require("express").Router();
const user = require("../models/user");
const verifyToken = require("../verifyToken");
const CryptoJS = require("crypto-js");

//Update

router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      const updatedUser = await user.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Unauthorized: Access Denied");
  }
});

//DELETE

router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await user.findByIdAndDelete(req.params.id);
      res.status(200).json("The user has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not authenticated to delete the account");
  }
});

//GET

router.get("/find/:id", verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const User = await user.findById(req.params.id);
      const { password, ...info } = User._doc;
      res.status(200).json(info);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not authenticated to get the account");
  }
});

// GET ALL USERS

router.get("/", verifyToken, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const Users = query
        ? await user.find().sort({ _id: -1 }).limit(10)
        : user.find();
      res.status(200).json(Users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see all users");
  }
});

//stats

router.get("/stats",verifyToken, async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.getFullYear() - 1);

  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await user.aggregate([
      ({ $project: { month: { $month: $createdAt } } },
      { $group: { _id: "$month", $total: { $sum: 1 } } }),
    ]);

    res.status(200).json(data)
  } catch (err) {}
});

module.exports = router;
