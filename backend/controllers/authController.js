const sendEmail = require('../routes/sendEmail');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
//! register
const registerUser=async(req,res)=>{
    try{
const { name, email, password, phoneNumber, role, address } = req.body;

const userExists=await User.findOne({email});
//!check userExists
   if( userExists){

   return res.status(400).json({message:"this Email is already Exists"})
   }
   //!bcrypt password
   const salt =await bcrypt.genSalt(10)
   const hashedPassword= await bcrypt.hash(password,salt);

   //!create new user
   const user= await User.create({
      name,
      email,
      password: hashedPassword, 
      phoneNumber,
      role: role || "user",
      address
   })
   //! sending  data to react
if (user) {
  try {
        await sendEmail({
          email: user.email,
          subject: 'Welcome to MEAL-KIT! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <h2 style="color: #DD6B20;">Welcome, ${user.name}!</h2>
              <p style="font-size: 16px;">Your account has been created successfully.</p>
              <p>Get ready to cook delicious meals at home!</p>
            </div>
          `
        });
        console.log("Welcome email sent to:", user.email);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
res.status(201).json({
  message: "User registered successfully",
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address
  }
});
    } else {
      res.status(400).json({ message: ' invalid data ' });
    }

    }catch(err){
     res.status(500).json({ message: err.message });
    }

}
//! login

const loginUser=async(req,res)=>{
    try{
    const {password,email}=req.body;
//! search for user
    const user =await User.findOne({email});
    if (!user) {
      return res.status(401).json({ message: 'password or email is not valid' });
    }
//!matching

    const isMatch =await bcrypt.compare(password,user.password);
    //! check result
    if (user && isMatch) {
     res.status(200).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address, 
  token: generateToken(user._id)
});
    } else {
      res.status(401).json({ message: 'password or email is not valid'});
    }
}catch (err) {
    res.status(500).json({ message: err.message });
  };
}
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { registerUser,loginUser,getAllUsers };