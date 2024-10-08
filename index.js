require("dotenv").config()
const express=require("express");
const cookieParser = require("cookie-parser");
const path=require("path")
const mongoose  = require("mongoose");

const Blog=require('./models/blog')
const checkForAuth = require("./middlewares/auth");
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB connected..."))

const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");

const app=express();
const PORT=process.env.PORT||8000;
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(checkForAuth('token'))
app.use(express.static('public'))
app.set("view engine",'ejs')
app.set("views",path.resolve('./views'))

app.get("/",async(req,res)=>{
    const allBlog=await Blog.find({});
    res.render("homepage",{
        user:req.user,blog:allBlog
    });
})


app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT,()=>console.log(`Server strated at port ${PORT} ....`))




