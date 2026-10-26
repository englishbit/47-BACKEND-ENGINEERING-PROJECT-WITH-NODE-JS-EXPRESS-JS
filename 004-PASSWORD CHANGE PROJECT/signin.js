const express=require('express')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const User=require('./model')

const router=express.Router()

router.post('/',async(req,res)=>{
    try{
        const {email,password}=req.body

        if(typeof email !=='string' ||typeof password !=='string'){
            return res.status(401).json({message:"fill every field"})
        }

        const user=await User.findOne({
            email:email.trim().toLowerCase()
        })

        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(401).json({message:"invalid input"})

        }

        const token =jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET,
            {expiresIn:'1h'},
        )

        return res.json({token})


    }catch(err){

        return res.status(500).json({message:'server error'})

    }
})

module.exports=router