const express=require('express')
const bcrypt=require('bcryptjs')
const User=require('./models/User')

const router=express.Router()

router.post('/signup',async(req,res)=>{


    try{
        const {name,email,password}=req.body


    if(typeof name !== 'string' || typeof email !=='string' || typeof password !=='string'||
        !name.trim() || !email.trim()||!password.trim()
    ){
        return res.status(400).json({Message:'fill up every option'})
    }


    if(password.length<8){
        return res.status(400).json({message:'use at least 8 charecter'})
    }


    const newEmail=email.trim().toLowerCase()
    const existUser=await User.findOne({email:newEmail})
    if(existUser){
        return res.status(400).json({message:"email is already used"})
    }

    const hashPassword= await bcrypt.hash(password,12)

    await User.create({
        name:name.trim(),
        email:newEmail,
        password:hashPassword,
    })


    return res.status(201).json({message:"account created successfully"})



}catch(err){
    if(err===11000){
        return res.status(409).json({message:"email is already registered"})
    }

    console.error(err)
    return res.status(500).json({message:"server error"})

}
    


})

module.exports=router