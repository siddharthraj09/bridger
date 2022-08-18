import express from 'express'
// import gmailAPI from './readMessages.js'
// import gmailAPIPermission from "./gmailAPIPermission.js"
import "express-async-errors";
const app =express()
import routes  from './routes.js';

const port =9000

// const gmailDetailes = (req, res)=>{
// const ans =gmailAPI()
// console.log(ans)
// res.json({ans})
// }


app.use('/api',routes);
//async (req, res)=>{
    // const ans =await gmailAPIPermission()
 //   console.log('AFTER EXPRESSSSSSSSSS')
    //console.log(ans)//
    //res.json({ans:ans})
    // })

app.listen(port,()=>{
    console.log(`server is listening on ${port}`)
})