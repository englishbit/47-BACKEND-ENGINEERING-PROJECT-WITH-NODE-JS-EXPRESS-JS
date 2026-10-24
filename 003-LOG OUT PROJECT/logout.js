const express=require('express')
const jwt=require('jsonwebtoken')

const router=express.Router()

const cookieOptions={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:'lax',
    path:'/',
}

router.post('/logout',(req,res)=>{
    const token=req.cookies.token

    if(!token){
        return res.status(401).json({message:'you are not signed in'})
    }

    try{
        jwt.verify(token,process.env.JWT_SECRET)
        res.clearCookie('token',cookieOptions)
        return res.json({message:'logged out successfully'})
    }catch{
        cleareCookie('token',cookieOptions)
        return res.status(401).json({message:'invalid token '})

    }    

    
})


module.exports=router