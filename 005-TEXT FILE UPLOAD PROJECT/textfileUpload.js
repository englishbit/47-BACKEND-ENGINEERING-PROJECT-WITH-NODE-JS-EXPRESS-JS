const express=require('express')
const fs=require('node:fs/promises')
const path=require('node:path')
const {randomUUID}=require('node:crypto')

const router=express.Router()


router.post('/',async(req,res)=>{

    try{
        const {text}=req.body

    if(typeof text !=='string' || !text.trim() ){
        return res.status(400).json({error:"give text"})

    }

    const uploadDir=path.resolve(process.env.UPLOAD_DIR || 'uploads')
    
    const fileName=`${randomUUID()}.txt`

    await fs.writeFile(path.join(uploadDir,fileName),text,"utf8" )

    res.status(201).json({message:"file is saved"})


    }catch(err){
        console.error("file saved error",err)
        res.status(500).json({error:"could not saved the file"})

    }
    


})



module.exports=router