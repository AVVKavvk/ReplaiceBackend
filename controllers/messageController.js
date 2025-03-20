const Message = require('../models/message');
const User = require('../models/user');
const { getReciverSocketId,io } = require('../socket');
const { cloudinary } = require('../utils/cloudinary');
const { error, success } = require('../utils/wrapper');

const GetUsersForSidebar = async (req, res) => {

  try {
    
    const currentUserId = req.user._id;

    const allFilterUsers = await User.find({_id:{$ne:currentUserId}}).select("-password");

    return res.json(success(200, allFilterUsers));
  } catch (err) {
    return res.json(error(500, err.message))
  }
}

const GetMessages = async (req, res) => {

  try {
    const {id:userToChatId} = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: userToChatId },
        { sender: userToChatId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });

    return res.json(success(200, messages));

  } catch (err) {
    return res.json(error(500, err.message))
  }
}

const SendMessage = async (req, res) => {

  try {
    const { id: receiverId } = req.params;
    const {text,image} = req.body;

    const senderId = req.user._id;

    let imageURL;

    if(image){
      const uploadedResponse = await cloudinary.uploader.upload(image,{
        folder: "Replaice",
      })

      imageURL = uploadedResponse.secure_url;
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      image: imageURL
    })

    await message.save();

    const reciverSocketId = getReciverSocketId(receiverId);

    if(reciverSocketId){
      // console.log(message);
      io.to(reciverSocketId).emit("newMessage", message);
    }


    return res.json(success(201, message))

  } catch (err) {
    return res.json(error(500,err.message))
    
  }
}
module.exports = { GetUsersForSidebar ,GetMessages, SendMessage}