import jwt from 'jsonwebtoken'
export const generateToken = (userID, res) => {
    const token = jwt.sign({userID}, process.env.JWT_SECRET,{
        expiresIn: '7d'
    }); 
    res.cookie('jwt', token, {
         httpOnly: true, // prevents client side js from accessing the cookie
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict', // CSRF attacks cross site requests forgery attacks 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in miniseconds
    })
    return token;
}