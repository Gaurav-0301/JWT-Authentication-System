const user = require("../models/auth.model");
const sessionModel=require("../models/session.model");
const crypto = require("crypto");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getMe= async (req, res) => {
    try {
        const token=req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                status:false,
                message:"failed to fetch the user"
            });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const guest=await user.findById(decoded.id);


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
                message: "All fields are required "+ error,
            });
        }

        const isMatch = await user.findOne({ email });

        if (isMatch) {
            return res.status(400).json({
                success: false,
                message: "Account already exist "+error
            });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        let otp = 0;

        for (let i = 0; i < 6; i++) {

            otp = otp * 10 + Math.floor(Math.random() * 10);
        }

        console.log(otp);

        await user.create({
            userName,
            email,
            password: hashedPassword,
            otp,
        });

        res.status(200).json({
            success: true,
            message: "Please Check The Mail Inbox",
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to signup "+ error,
        });
    }
};

const otpVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        const currentUser = await user.findById(id);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (currentUser.otp != otp) {
            return res.status(400).json({
                success: false,
                message: "Otp verification failed",
            });
        }
       
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

    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session=await sessionModel.findOne({
            refreshTokenHash,
            revoked:false
        })

        if(!session){
            return res.status(400).json({
                success:false,
                message:"session not found"
            })
        }

    if(!refreshToken){
        return res.status(400).json({
            success:false,
            message:"failed to fetch refreshToken"
        });
    }


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
           message:"refreshToken nnot found"
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
            message:"logout successfully"
        })
    
} catch (error) {
    res.status(400).json({
        success:false,
        message:"Failed to logout "+error
    })
}
}

const profileEdit=async(req,res)=>{
console.log("profileEdit")
}

module.exports={getMe,signUp,profileEdit,logout,otpVerification,accessToken};