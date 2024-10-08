const { validateToken } = require("../auth");

function checkForAuth(cookieName){
    return (req,res,next)=>{
        const token=req.cookies[cookieName];
        if(!token){
            return next()
        }
        try {
            const payload=validateToken(token)
            req.user=payload
        } catch (error) {
            
        }
        return next()
    }
}

module.exports=checkForAuth