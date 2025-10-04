const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/user');
const router=express.Router();
const validateEmail=(email)=>{
    const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
const validatePassword=password=>{
    const re=/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return re.test(password);
}
router.post('/register',async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        if(!name||!email||!password){
            return res.status(400).json({msg:"All fields are required"});
        }
        if(!validateEmail(email)){
            return res.status(400).json({msg:"Invalid email format"});
        }
        if(!validatePassword(password)){
            return res.status(400).json({msg:"Password must be at least 8 characters long and include at least one special character"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=new User({
            name,
            email,
            password:hashedPassword
        });
            await user.save();
            res.status(201).json({msg:"User registered successfully"});
    }
    catch(error){
        return res.status(500).json({msg:error.message});
    }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User with this email doesn't exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Please enter the correct password" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;