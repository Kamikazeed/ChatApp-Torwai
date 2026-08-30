import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decode.userId).select('-password');
    if(!user) res.json({success: false, message: 'User not found'})

    req.user = user;
    next();
    
  } catch (err) {
    res.json({success: false, message: err.message});
    console.log(err.message);
  }
}