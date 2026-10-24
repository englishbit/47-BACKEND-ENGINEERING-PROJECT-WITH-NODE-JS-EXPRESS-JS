const express=require('express')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const User=require('./models/User')


const router=express.Router()

const cookieOptions={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:'lax',
    maxAge:60*60*1000,
    path:'/',
}




router.post('/signin',async(req,res)=>{
    
    try{
        const{email,password}=req.body
        if(typeof email !=='string' || typeof password !=='string'){
            return res.status(400).json({message:"email or password are required"})

        }

        const user=await User.findOne({email:email.trim().toLowerCase()})

        if(!user || (!await bcrypt.compare(password,user.password)) ){
            return res.status(401).json('invalid email or password')
        }


        const token=jwt.sign(
            {userId:user._id.toString()},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}

        )

        res.cookie('token',token,cookieOptions)

        return res.json({message:'Signed in successfully'})

    }catch(err){
        console.error(err)
        return res.status(500).json({message:"server error"})
    }
})


module.exports=router