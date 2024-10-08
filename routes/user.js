const { Router } = require("express");
const bcrypt = require("bcrypt")
const User = require("../models/user");
const { createToken } = require("../auth");
const router = Router();

router.get('/signup', (req, res) => {
    res.render('signup');
})
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/signup', async (req, res) => {
    // console.log(req.body);
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All field are required' });
    }

    // Simulate saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        fullName,
        email,
        password: hashedPassword
    })

    return res.redirect('/');
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        
        // If user is not found, return an error
        if (!user) {
            return res.render('login', { error: "Invalid email or password!" });
        }

        // Compare the provided password with the hashed password stored in the database
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.render('login', { error: "Invalid email or password!" });
        }

        // Generate JWT token
        const token = createToken(user);
        console.log("token: ", token);

        // Return the JWT token or set it in a cookie
        // Here, we're redirecting, but you can also return the token in the response
        return res.cookie("token",token).redirect('/'); // Redirect to home or another route after successful login
    } catch (err) {
        console.error(err);
        return res.render('login', { error: "An error occurred during login!" });
    }
});

router.get('/logout',(req,res)=>{
     res.clearCookie('token').redirect('/')
})


module.exports = router;