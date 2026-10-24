///// import important library

require('dotenv').config()
const mongoose=require('mongoose')
const app=require('./app')


if(!process.env.JWT_SECRET || !process.env.MONGODB_URI){
    throw new Error("jwt secret or db uri is missing ")
}

/// db connection and server starting code

async function start(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)

        PORT=process.env.PORT || 3000

        app.listen(PORT,()=>{
            console.log("server is running")
        })
    }catch(err){
        if(err){
            console.error('server error happens',err.message)
        }
    }
}

start()