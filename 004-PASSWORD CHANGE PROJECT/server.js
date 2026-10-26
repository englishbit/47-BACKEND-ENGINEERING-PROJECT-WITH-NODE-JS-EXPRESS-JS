require('dotenv').config()
const mongoose=require('mongoose')
const app=require('./app')


const PORT=process.env.PORT || 3000

async  function start(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(PORT,()=>{
            console.log('server is running')

        })

    }catch(err){
        console.error('server is not start',err.message)
        process.exit(1)

    }
}

start()