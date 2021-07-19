const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require("crypto-js")

//REGISTER
router.post("/register", async (req,res) => {
  const newUser = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const user = await newUser.save() //saved it
    res.status(201).json(user) //sended response
  } catch(err) {
    res.status(500).json(err)
  }
  
})

module.exports = router;