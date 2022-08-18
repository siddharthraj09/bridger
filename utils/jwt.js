import  jwt from 'jsonwebtoken';

//!Creating JWT token
const createJWT = async (user) =>{
    try {
        return jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    } catch (error) {
        console.log(error)
    }
   
}
    
 export default createJWT 