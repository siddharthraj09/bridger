import bcrypt from 'bcrypt'

//! Hashing  password
const hashPassword =async (pass)=>{
    const salt =await bcrypt.genSalt(10)
    let newPassword = await bcrypt.hash(pass,salt)
    return newPassword
}

export default hashPassword