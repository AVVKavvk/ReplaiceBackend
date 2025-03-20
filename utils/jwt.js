const jwt = require('jsonwebtoken')

const generateToken = (userId, res)=>{
  const token = jwt.sign({userId}, process.env.JWT_Token,{
    expiresIn:"7d"
  })

  res.cookie("jwt_token",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite:"None",
    secure:true
  })
}

module.exports = {generateToken}