
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err,req,res,next)=>{
    console.log(err);
    const defaultError = {
        statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message ||'Something went wrong,try again later'
    }
    if(err.code === 'P2007'){
        defaultError.statusCode=StatusCodes.BAD_REQUEST
       // defaultError.msg=err.message
    //    defaultError.msg=Object.values(err.errors).map((item)=>{
    //        return item.message
    //    }).join(',')
    }
    if(err.code && err.code == 'P2002'){
        defaultError.statusCode=StatusCodes.BAD_REQUEST
        defaultError.msg=`${err.meta.target} field has to be unique`
    }
    // res.status(defaultError.statusCode).json({msg:err})
    res.status(defaultError.statusCode).json({msg:defaultError.msg})

}
export default errorHandlerMiddleware