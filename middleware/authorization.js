
import  {UnAuthenticatedError}  from "../errors/index.js";
import jwt from 'jsonwebtoken'

const auth= async (req,res,next) =>{
    const authHeader =req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAuthenticatedError('Authentication invalid')
      }
      const token = authHeader.split(' ')[1]
    
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(payload)
        // attach the user request object
        // req.user = payload
        req.user = { userId: payload.userId,
 }
        console.log(req.user)
        next()
      } catch (error) {
        throw new UnAuthenticatedError('Authentication invalid')
      }
    }
export default auth