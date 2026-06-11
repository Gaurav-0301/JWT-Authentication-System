const user = require("../models/auth.model");
const sessionModel=require("../models/session.model");
const crypto = require("crypto");
const otp=require("../utils/otp.util")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpModel=require("../models/otp.model");

const getMe= async (req, res) => {
    try {
        const token=req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                status:false,
                message:"No token provided !!"
            });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const guest=await user.findById(decoded.id);

        if(!guest){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        res.status(200).json({
            success: true,
            message:"User fetch successfully",
            userCredential:  {
                userName:guest.userName,
                email:guest.email,

            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetching the users "+ error,
        });
    }
};

const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required "
            });
        }

        const isMatch = await user.findOne({ email });

        if (isMatch) {
            return res.status(400).json({
                success: false,
                message: "Account already exist with this eamil",
            });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

            const newUser=await user.create({
            userName,
            email,
            password: hashedPassword,
            isVerified:false,
           
        });

         var generatedOtp=otp();
         const activeOtp=await otpModel.create({
            id:newUser._id,
            otp:generatedOtp,
         })

        res.status(200).json({
            success: true,
            message: "Please Check The Mail Inbox for OTP vaild for 10 minutes",
            user_id:newUser._id,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to signup "+ error.message,
        });
    }
};

const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            });
        }

            const currentUser=await user.findOne({email});
            if(!currentUser){
                return res.status(400).json({
                    success:false,
                    message:"Invalid user credentials"
                });
            }

            const isMatch = await bcrypt.compare(password, currentUser.password);
            if(!isMatch){
                return res.status(400).json({
                    success:false,
                    message:"Invalid credentials"
                })
            }

        var generatedOtp=otp();
         const activeOtp=await otpModel.create({
            id:currentUser._id,
            otp:generatedOtp,
         })

            res.status(201).json({
                success:true,
                message:"verification OTP is send.Please verify"
            })
       
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"Failed to login "+ error
        })
    }
}

const otpVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        const activeOtp = await otpModel.findById(id);
        const currentUser=await user.findById(id);

        if (!activeOtp) {
            return res.status(404).json({
                success: false,
                message: "Invalid Request",
            });
        }
        
        if(Datre.now>new Date(activeOtp.otpExpiresAt).getTime()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired !!"
            });
        }
        if (activeOtp.otp != otp) {
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP",
            });
        }
        
        activeOtp.otp=null;
        activeOtp.otpExpiresAt=null;
        await otpModel.save();

        currentUser.isVerified=true;
        await user.save();
       
         const refreshToken=jwt.sign(
            {id:currentUser.id},
            process.env.JWT_SECRET,
            { expiresIn:"7d"}
        );
        
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        
        const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");


        const session=await sessionModel.create({
            user:currentUser.id,
            refreshTokenHash,
            ip:req.ip,
            userAgent:req.headers["user-agent"]


        });

        const accessToken = jwt.sign(
            { id: currentUser._id,
                sessionId:session._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
         

     

        res.status(200).json({
            success: true,
            message: "User signup successfully",
            accessToken,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to verify the otp "+ error,
        });
    }
}

const accessToken=async(req,res)=>{
   try {
    var {refreshToken}=req.cookies;
   if(!refreshToken){
    return res.status(401).json({
        success:false,
        message:"refreshToken is missing."
    });
   }
    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session=await sessionModel.findOne({
            refreshTokenHash,
            revoked:false
        })

        if(!session){
            return res.status(400).json({
                success:false,
                message:"session not found"
            });
        }
            session.revoked=true;
            await session.save();

     const decoded=jwt.verify(
        refreshToken,
        process.env.JWT_SECRET
    );


    const accessToken=jwt.sign(
        {id:decoded.id},
        process.env.JWT_SECRET,
        {expiresIn:"15m"}
    );

     const newRefreshToken=jwt.sign(
        {id:decoded.id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
   );


    var newRefreshTokenHash=crypto.createHash("sha256").update(newRefreshToken).digest("hex");;

  session.refreshTokenHash=newRefreshTokenHash;
  await session.save();
     
    res.cookie("refreshToken",newRefreshToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json({
        success:true,
        message:"accessToken generated successfully",
        accessToken,
    });
   } catch (error) {
    res.status(400).json({
        success:false,
        message:"failed to generate the accessToken " + error
    })
   }
}





const logout=async(req,res)=>{
try {
    const {refreshToken}=req.cookies;

    if(!refreshToken){
        return res.status(400).json({
           success:false,
           message:"No Active refreshToken found"
        });
    }
      
       
        const refreshTokenHash=await crypto.createHash("sha256").update(refreshToken).digest("hex")

        const session=await sessionModel.findOne(
           { 
            refreshTokenHash,
            revoked:false,
        }
        );
     
        if(!session){
            return res.status(400).json({
                success:false,
                message:"session not found"
            });
        }
            session.revoked=true;
            await session.save();


         res.clearCookie("refreshToken", {
          httpOnly: true,
        secure: process.env.NODE_ENV === "production"
       });
         
        res.status(200).json({
            success:true,
            message:"Logout successfully"
        })
    
} catch (error) {
    res.status(400).json({
        success:false,
        message:"Failed to Logout "+error
    })
}
}



module.exports={getMe,signUp,logout,otpVerification,accessToken,login};