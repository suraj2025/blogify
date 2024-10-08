const { Schema, model } = require("mongoose");

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileimage:{
        type:String,
        default:"avatar.png"
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
    
},{timestamps:true})

const User=model("user",userSchema);
module.exports=User;