const express=require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser');

const JWT_SECRET='preetii$agoodgirl';
//ROUTER1:create a user using:POST "/api/auth/createuser",doesnt req auth.No login required
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid password').isLength({min:5}),
],async(req,res)=>{
    let success=false;
    //if there are errors then return bad req and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,errors:errors.array()});
    }
    // check wjhethr user with same mail exists
    try{

    
    let user= await  User.findOne({email:req.body.email});
    
    if(user){
        return res.status(400).json({success,error:"sorry but user with this mail alrady exists"})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    //create  a user
   user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass
    })
    // .then(user=>res.json(user))
    // .catch(err=>{console.log(err)
    //     res.json({error:'Please enter a unique value for email',message:err.message})})
   const data={
    user:{
        id:user.id
    }
   }
   const authtoken=jwt.sign(data,JWT_SECRET);
  success=true;
    res.json({success,authtoken})

}catch(error){
    console.log(error.message);
    res.status(500).send("internal server error occured");
}
})

//ROUTER2:authenticate a user using:POST "/api/auth/login"
router.post('/login',[
 
    body('email','Enter a valid email').isEmail(),
 
    body('password','password cannot be blank').exists()
 
],async(req,res)=>{
    let success=false;
 //if there are errors then return bad req and errors
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({errors:errors.array()});
 }
 const{email,password}=req.body;
 try{
    let user= await  User.findOne({email});
    if(!user){
        success=false
        return res.status(400).json({error:"Please login with correct credantials"})
    }
const passwordCompare=await bcrypt.compare(password,user.password)
if(!passwordCompare){
    success=false
    return res.status(400).json({success,error:"Please login with correct credantials"})
}
const data={
    user:{
        id:user.id
    }
   }
   const authtoken=jwt.sign(data,JWT_SECRET);
   success=true;
    res.json({success,authtoken})

  } catch(error){
    console.log(error.message);
    res.status(500).send("Internal server error");
    }
 
})

//ROUTER3:get loggedin user detaile using:POST "/api/auth/getuser" Login required
router.post('/getuser',fetchuser,async(req,res)=>{
    try{
        userId=req.user.id;
        const user= await User.findById(userId).select('-password');
        res.send(user)
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal server error");
        }
     
    })

module.exports=router