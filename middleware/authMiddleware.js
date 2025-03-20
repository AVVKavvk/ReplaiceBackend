const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { error } = require('../utils/wrapper')

const isUserAuthenticated = async (req,res,next)=>{
  try {
    
    const token = req.cookies.jwt_token;
    if(!token) return res.json(error(401,"Unauthorized"))
    const decoded = jwt.verify(token,process.env.JWT_Token)

    if(!decoded) return res.json(error(401,"Unauthorized token is invalid"))

    const user = await User.findById(decoded.userId).select("-password")
    if(!user) return res.json(error(401,"Unauthorized user not found"))

    req.user = user;
    next()
    
  } catch (err) {
    return res.json(error(500,err.message))
  }
}

module.exports = {isUserAuthenticated}