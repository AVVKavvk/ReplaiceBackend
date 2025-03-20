const User = require("../models/user")
const {success,error} = require("../utils/wrapper")
const {generateToken} = require('../utils/jwt')
const bcrypt = require('bcryptjs')
const {cloudinary} = require('../utils/cloudinary')

const Signup = async (req,res)=>{

  try {
    const {fullName,email,password} = req.body;
    
    if(!fullName || !email || !password) 
      return res.json(error(400,"All fields are required"))

    if(password && password.length<6){
      return res.json(error(402,"Password length should be more than 6"))
    }

    const oldUser = await User.findOne({email});

    if(oldUser){
      return res.json(error(400,"Email already registered"));

    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
      fullName,
      email,
      password:hashedPassword
    })

    if(newUser){
        generateToken(newUser._id,res);

        await newUser.save();

        return res.json(success(201, {
          _id:newUser._id,
          fullName:newUser.fullName,
          email:newUser.email,
          profilePic:newUser.profilePic
        }))
    }
    else{
      res.json(error(400,"Invaild user data"))
    }

  } catch (err) {
    return res.json(error(500,err.message))
  }
}

const Login = async (req,res)=>{

  try {
    const {email,password} = req.body;

    if(!email || !password) 
      return res.json(error(400,"All fields are required"))

    const oldUser = await User.findOne({email});

    if(!oldUser){
      return res.json(error(400,"invalid credentials"));
    }

    const isPasswordCorrect = await bcrypt.compare(password,oldUser.password);

    if(!isPasswordCorrect){
      return res.json(error(400,"invalid credentials"));
    }

    generateToken(oldUser._id,res);

    return res.json(success(200,{
      _id:oldUser._id,
      fullName:oldUser.fullName,
      email:oldUser.email,
      profilePic:oldUser.profilePic
    }))

  } catch (err) {
    return res.json(error(500,err.message));
  }
}

const Logout = async (req,res)=>{
  try {
    res.cookie("jwt_token","",{
      maxAge:0
    });
    return res.json(success(200,"Logged out successfully"))
  } catch (err) {
    return res.json(error(500,err.message));
  }
}

const UpdateProfile = async (req,res)=>{
  try {
  const {profilePic} = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);

  const cloudinary_url = await cloudinary.uploader.upload(profilePic,{
    folder: "Replaice",
  })
  
  user.profilePic = cloudinary_url.url

  await user.save();

  return res.json(success(200,user))

  } catch (err) {
    return res.json(error(500,err.message));
  }
}

const CheckAuthenticity = async (req,res)=>{
  try {
    return res.json(success(200,{user:req.user}))
  } catch (err) {
    return res.json(error(500,err.message));
  }
}

const GetUserById = async (req,res)=>{

  try {
    const {id} = req.params;

    if(!id) return res.json(error(400,"User id is required"));

    const user = await User.findById(id).select("-password");

    if(!user) return res.json(error(404,"User not found"));

    return res.json(success(200,user));
  } catch (err) {
    return res.json(error(500,err.message));    
  }
}
module.exports = {Signup,Login, Logout,UpdateProfile,CheckAuthenticity,GetUserById}