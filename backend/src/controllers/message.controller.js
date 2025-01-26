import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId,io } from '../lib/socket.js';
export const getUserForsidebar= async(req, res) => {
try{
    const loggefdInUser = req.user._id;
    const filterUser = await User.find({_id: {$ne: loggefdInUser}}).select('-password')
    res.status(200).json(filterUser)
}catch(error){
console.log("Error in getUserForsidebar controller", error.message)
res.status(500).json({message: error.message})
}
}
export const getMessage = async(req, res) => {
    try{
        const {id:userToChatId} = req.params
        const MyId = req.user._id
        const message = await Message.find({$or:
           [ {senderId:MyId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:MyId}
    ],
});
res.status(200).json({message})
    }catch(error){
        console.log("Error in getMessage controller", error.message)
        res.status(500).json({message: error.message})
    }
}
export const sendMessage = async(req, res) => {
    try{
         const {text,image}=  req.body
         
         const {id:receiverId} = req.params
        
         const senderId = req.user._id
         //console.log(image)
         let imageURL;
         if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
         }
         const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image:imageURL,
         });
         await newMessage.save();
         // todo : real time message => socket.io\
         const receiversocketId = getReceiverSocketId(receiverId)
         if(receiversocketId){
             io.to(receiversocketId).emit('newMessage', newMessage)
         }




         res.status(201).json(newMessage)
         }
    




catch(error){
    console.log("Error in sendMessage controller", error.message)
    res.status(500).json({message: error.message})
}
}