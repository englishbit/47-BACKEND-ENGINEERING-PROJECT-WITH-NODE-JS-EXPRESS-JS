// import important library

const express=require('express')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')



const epp=express()
epp.use(express.json())

const MONGO_URI=process.env.MONGO_URI || "mongodb://127.0.0.1:27017/signin_app"

const JWT_SECRET=process.env.JWT_SECRET || "local-practice-secret-change-me"

const PORT=process.env.PORT|| 3000



const userSchema=new mongoose.Schema({
    email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    password:{type:String,required:true,}
})


const User=mongoose.model("User",userSchema)


// this is  sign up api

epp.post('/signup',async(req,res)=>{
   try{


     const {email,password}=req.body

    // specail case handling

    if(!email || !password){
        return res.status(400).json({error:"give input in the fields"})
    }


    // special case handling
    if(email.length<8){
        return res.status(400).json({error:"give at least 8 charecter"})
    }


    // refining the email

   const newEmail=email.trim().toLowerCase()



   // conforming an account is exist or not by this email
   liveUser=await User.findOne({email:newEmail})

   if(liveUser){
        return res.status(409).json({error:"the email is already used"})

   }


   //hashing the password

   const newPassword=await bcrypt.hash(password,12)

   // store the user information in db
   const user=await User.create({email:newEmail,password:newPassword})

   res.status(201).json({message:"account created successfully"})


   }catch(err){
         if(err.code===11000){
            return res.status(409).json({message:"this email is already registerd"})
         }

            console.error(err)
            res.status(500).json({error:"server error"})

   }



})

//the sign in api

epp.post('/signin',async(req,res)=>{
    try{
        const {email,password}=req.body


        //special case handle

        if(!email || !password){
            return res.status(400).json({error:"email and password is must"})
        }

        //

        const findUser=await User.findOne({email:email.trim().toLowerCase()})

        if(!findUser || (!await bcrypt.compare(password,findUser.password))){
            return res.status(401).json({error:"invalid email or password"})
        }

        

        const token =jwt.sign({userId:findUser._id},JWT_SECRET,{expiresIn:"1h"})
        res.json({message:"signed in successfully"})
    }catch(err){
        console.error(err)
        res.status(500).json({error:"server error"})

    }
})



/// verifying the jwt tokens work or not by a new api 

epp.get('/new',async(req,res)=>{
    try{
        const header=req.headers.authorization || " "
        const token=header.startsWith("Bearer")? header.slice(7):null
        
        if(!token){return res.status(401).json({error:"the token is not found"})}


        tokenVerify=jwt.verify(token,JWT_SECRET)



        existUser=await User.findById(tokenVerify.userId).select("id_email")

        if(!existUser){return res.status(400).json({error:"User not found"})}
        res.json({existUser})

    }catch(err){
        res.status(401).json({error:"invalid token"})

    }
})

mongoose.connect(MONGO_URI).then(()=>{
    console.log("db is connected")
    epp.listen(PORT,()=>{
        console.log('server is running')
    })
}).catch((error)=>{
    console.error("db could not connected",error.message)
    process.exit(1)
})











