import cloudinary from "../config/cloudinary.js";
import msgModel from "../models/msgModel.js";
import userModel from "../models/userModel.js";
import {io, userSocketMap} from '../server.js'

export const getUsersForSidebar = async (req, res) => {
 try {
  const userId = req.user._id;
  const filteredUsers = await userModel.find({_id: {$ne: userId}}).select('-password')

  const unseenMessages = {}
  const promises = filteredUsers.map(async (user) => {
    const messages = await msgModel.find({senderId: user._id, receiverId: userId, seen: false})
    if(messages.length > 0) {
      unseenMessages[user._id] = messages.length;
    }
    
  })

  await Promise.all(promises);
  res.json({success: true, users: filteredUsers, unseenMessages})
  
 } catch (err) {
  res.json({success: false, message: err.message});
  console.log(err.message);
 }
}

export const getMessages = async (req, res) => {
 try {
  const {id: selectedUserId} = req.params;
  const myId = req.user._id;

  const messages = await msgModel.find({
    $or: [
      {senderId: myId, receiverId: selectedUserId},
      {senderId: selectedUserId, receiverId: myId},
    ]
  })
  await msgModel.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});
  res.json({success: true, messages});

 } catch (err) {
  res.json({success: false, message: err.message});
  console.log(err.message);
 }
}

export const markMessageAsSeen = async (req, res) => {
  try {
    const {id} = req.params;
    await msgModel.findByIdAndUpdate(id, {seen: true})
    res.json({success: true})
    
  } catch (err) {
    res.json({success: false, message: err.message});
    console.log(err.message);
  }
}

export const sendMessage = async (req, res) => {
  try {
    const {text, image} = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await msgModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    res.json({success: true, newMessage})
    
  } catch (err) {
    res.json({success: false, message: err.message});
    console.log(err.message);
  }
}