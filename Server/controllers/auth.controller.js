const user=require("../models/auth.model")
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")

const allUsers=async(req,res)=>{
try {
    const res=await user.find()
    console.log(res);

    res.status(200).json({
        success:true,
        message:res,
    });

} catch (error) {
      res.status(500).json({
        success:false,
        message:"Failed to fetching the users",
    });
}
}

const signUp=async(req,res)=>{
    try {
        const {userName,email,password}=req.body;
        if(!userName || !email || !password){
            res.status(400).json({
                success:false,
                message:"All fields are required"
            });

           var isMatch=await user.find({email});
           if(isMatch){
             res.status(400).json({
                success:false,
                message:"Account already exist"
            });

            const salt=10;
            const hashedPassword= await bcrypt.hash(password,salt);

            const otp=0,x;
            for(var i=0;i<=5;i++){
              x=Math.floor(Math.random()*10);
              otp=otp*10+x;
            }
           console.log(otp);
            const newUser=await user.create({
                userName,
                email,
                password:hashedPassword,
                otp,
            });

            res.status(200).json({
                success:true,
                message:"Please Check The Mail Indox"
            })

           }
       }
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"Failed to signup"
        });

    }

}

const otpVerification=async(req,res)=>{
   
    try {
        const {id}=req.params.id;
        const {otp}=req.body; 
        const userOtp=await user.findOne({id}).otp;
        if(userOtp==otp){
            res.status(200).json({
                success:true,
                message:"Otp verification successfully"
            });

            const token=jwt.sign(
                {id:user_id},
                process.env.JWT_SECRET,
                {expiresIn:"2d"},
            );

            res.cookie("token",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV ==="production",
                maxAge:7*24*60*60,
            });
           res.status(200).json({
            success:true,
            message:"User signup successfully"
           })
        }

    } catch (error) {
        res.send
    }
}

const profileEdit=async(req,res)=>{
console.log("profileEdit")
}

const logout=async(req,res)=>{
console.log("logout")
}

module.exports={allUsers,signUp,profileEdit,logout};