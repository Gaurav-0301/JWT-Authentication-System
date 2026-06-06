const user = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const allUsers = async (req, res) => {
    try {
        const users = await user.find();
        console.log(users);

        res.status(200).json({
            success: true,
            message: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetching the users"+ error,
        });
    }
};

const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"+ error,
            });
        }

        const isMatch = await user.findOne({ email });

        if (isMatch) {
            return res.status(400).json({
                success: false,
                message: "Account already exist",
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
            message: "Failed to signup"+ error,
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

        const token = jwt.sign(
            { id: currentUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "User signup successfully",
            token,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to verify the otp"+ error,
        });
    }
}


const profileEdit=async(req,res)=>{
console.log("profileEdit")
}

const logout=async(req,res)=>{
console.log("logout")
}

module.exports={allUsers,signUp,profileEdit,logout,otpVerification};