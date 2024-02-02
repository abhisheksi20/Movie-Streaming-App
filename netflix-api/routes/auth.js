const user = require("../models/user");

const router = require("express").Router();
const CryptoJS = require("crypto-js");

const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const newUser = new user({
      userName: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });

    const User = await newUser.save();

    res.status(201).json(User);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    //Remember that the model name and the variable should be different
    const userModel = await user.findOne({ email: req.body.email });
    !userModel && res.status(404).json("Wrong Password or User");
    const byte = CryptoJS.AES.decrypt(
      userModel.password,
      process.env.SECRET_KEY
    );
    const originalPassword = byte.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(404).json("Wrong Password or User");

    // I dont want to send password to the front end then

    const { password, ...info } = userModel._doc;

    const accessToken = jwt.sign(
      { id: userModel._id, isAdmin: userModel.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    res.status(200).json({...info, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
