const jwt=require('jsonwebtoken')
const User=require('./model')


async function verifyToken(req,res,next){
    const header=req.headers.authorization
    const [schema,token]=header?.split(" ")?? []



    if(schema !=='Bearer' || !token){
        return res.status(401).json({message:'verification is need'})
    }

    

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(payload.userId);

if (!user) {
    return res.status(401).json({ message: 'invalid token' });
}

req.user = user;
return next();

    }catch(err){
        return res.status(401).json({message:'invalid token'})

    }

}

module.exports=verifyToken