const User = require("../../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const constants = require('../../config/constants.json')
Login = async (req, res) => {
  try {
    //check the validity of the username
    const user = await User.findOne({ username: req.body.username })
    if (!user)
      return res.status(422).json({error:constants.errorMessages.invalidUsername})
    //the password validety
    //we check if the given password matches the hashed store password 
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass)
      return res.status(422).json({error:constants.errorMessages.invalidPassword})
    
    // Generate and return  token
    const token = jwt.sign({ userId: user._id, userType:user.type}, process.env.TOKEN)
    res.header('Authorization', token).json({ token: token,userType: user.type})
  } catch (error) { res.status(400).json({ error: error.message }) }
}

getUserId =  (token) =>  {
      token = token.replace('Bearer ','')
      const verified = jwt.verify(token, process.env.TOKEN) 
      return verified.userId
}
module.exports = { Login, getUserId }