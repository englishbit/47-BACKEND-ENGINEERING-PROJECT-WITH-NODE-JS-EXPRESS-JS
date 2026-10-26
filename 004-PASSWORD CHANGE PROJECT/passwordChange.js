const express=require('express')
const bcrypt=require('bcryptjs')
const verifyToken=require('./auth')

const router=express.Router()

router.post('/',verifyToken,async(req,res)=>{
    try{
        const{currentPassword,newPassword}=req.body

        if(typeof currentPassword !=='string' || typeof newPassword !=='string'||
            newPassword.length<8
        ){
            return res.status(400).json({message:'invlid input'})
        }

        const found=bcrypt.compare(currentPassword,req.user.password)
        if(!found){return res.status(401).json({message:'current password is incorrect'})}
        
        req.user.password=await bcrypt.hash(newPassword,12)
        await req.user.save()

        return res.json({message:'Password changed successfully'})


    }catch(err){
        return res.json({message:"server error"})

    }
})

module.exports=router