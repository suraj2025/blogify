const jwt=require("jsonwebtoken")
const secret="avengers@123"


function createToken(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email:user.email
    }
    const token=jwt.sign(payload,secret);
    return token;

}
function validateToken(token){
    const payload=jwt.verify(token,secret)
    return payload;

}

module.exports={createToken,validateToken}