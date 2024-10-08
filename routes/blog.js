const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const path=require("path")
const router = Router();
const multer=require("multer")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/uploads/'))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/add-blog',async(req,res)=>{
    res.render("addBlog",{
        user:req.user
    })
})

router.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy")
   
    const comments=await Comment.find({blogId:req.params.id}).populate("createdBy")
    res.render("blog",{blog,user:req.user,comments})
})
router.post('/add-blog',upload.single("coverImage"), async (req, res) => {
    const {title, body } = req.body;
    try {
      
      const blog=await Blog.create({
          title,
          body,
          createdBy:req.user._id,
          coverImage:`uploads/${req.file.filename}`
      })
      return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
      return res.redirect('/blog/add-blog')
    }
    

})

router.post('/comment/:blogId', async (req, res) => {
  const { content } = req.body;

  // Basic validation
  

  try {
    await Comment.create({
      content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.redirect(`/blog/${req.params.blogId}`);
  }
});




module.exports = router;