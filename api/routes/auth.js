const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req,res) => {
  const newUser = new User({
    username: req.body.userName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY //crypt
    ).toString(),
  });

  try {
    const user = await newUser.save() //saved it
    res.status(201).json(user) //sended response
  } catch(err) {
    res.status(500).json(err)
  }
})

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });
    !user && res.status(401).json("Wrong password or username!")

    //decrypt
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8)
    
    originalPassword !== req.body.password && 
      res.status(401).json("Wrong password or username!");

      const accessToken = jwt.sign({
        id: user._id, isAdmin: user.isAdmin
      }, process.env.SECRET_KEY, { expiresIn: "5d" })
    
    //calling password and other info
    const { password, ...info } = user._doc;

    res.status(200).json({...info, accessToken})

  } catch(err) {
    res.status(500).json
  }
})

module.exports = router;