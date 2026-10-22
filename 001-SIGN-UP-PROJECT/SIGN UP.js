/// import important library


const express=require('express')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')


/// defining the port & middle ware
const epp=express()
const PORT = 3000

epp.use(express.json())


//defining the database model blue print

const userschema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },

        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },

        password:{
            type:String,
            required:true,
        },

    },
    {timestamps:true}
)



//creating the model

const User=mongoose.model("User",userschema)



//controller logic for sing up 

epp.post("/signup",async(req,res)=>{



    try{
        const{name,email,password}=req.body
        
        // handling special case
        if(!name||!email||!password){
            return res.status(400).json({
                message:"filled every field",
            })
        }


        //special case
        if(password.length<8){
            return res.status(400).json({
                message:"give minimum 8 charecter",
            })
        }

        const newEmail=email.trim().toLowerCase()

        const existUser=await User.findOne({email:newEmail})
        

        //special case
        if(existUser){
            return res.status(409).json({
                message:"already created an acoount by this email" 
            })
        }


        // hashing the password
        const hshPassword=await bcrypt.hash(password,12)

        // store the user information in db
        const user=await User.create({
            name:name.trim(),
            email:newEmail,
            password:hshPassword,
        })

        res.status(201).json({
            message:"account created successfully"
        })


    }catch(err){
        if (err.code===11000){
              return res.status(409).json({
                message:'already have an account'
              })
        }

        console.error(err)
        return res.status(500).json({
            message:"the server error"
        })
    }




})



//////////// the server starting logic and db connection logic 

async function start(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/express_practice")
        console.log("db is connected")
        

        epp.listen(PORT,()=>{
            console.log("server is running")
        })
    }catch(err){
        console.error("the server could not connect the db",err)

    }
}

start()
