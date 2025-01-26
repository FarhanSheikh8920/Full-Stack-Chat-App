import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
   try {
    const token = req.cookies.jwt

    if (!token) {
        return res.status(401).json({ message: "You are not logged in" })
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
   //console.log(decoded)
    if(!decoded) {
        return res.status(401).json({message: "token is invalid"})
    }
        const user = await User.findById(decoded.userID).select('-password')
    if(!user) return res.status(401).json({message: "user not found"})
    req.user = user
     // console.log(req.user)
        next();
    
   } catch (error) {
    console.log("Error in protectRoute middleware", error.message)
    res.status(500).json({ message: "Internal Server Error" })
   } 
}