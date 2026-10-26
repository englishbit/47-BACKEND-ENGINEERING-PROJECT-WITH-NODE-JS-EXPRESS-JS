const express=require('express')
const bcrypt=require('bcryptjs')
const User=require('./model')

const router=express.Router()

router.post('/',async(req,res)=>{
    try{
            const{email,password}=req.body

       if(typeof email !=='string' || typeof password !=='string' || password.length<8){
              return res.status(400).json({message:'invalid input'})
        }
    
    const refineEmail=email.trim().toLowerCase()
    const existUser=await User.findOne({email:refineEmail})
    if(existUser){return res.status(409).json({message:'this email is used yet'})}

    const hashPassword=await bcrypt.hash(password,12)

    await User.create({
        email:refineEmail,
        password:hashPassword,
    })

    return res.status(201).json({message:'account created successfully'})





    }catch(err){

        if(err.code===11000){
            return res.status(409).json({message:'email is already registered'})
        }


        return res.status(500).json({message:'server error'})



    }

})

module.exports=router