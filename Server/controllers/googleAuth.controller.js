const axios = require("axios");
const jwt = require("jsonwebtoken");
const googleAuthModel = require("../models/googleAuth.model");
const oauth2client = require("../utils/googleAuthConfig"); 

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    console.log(code);
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2client.getToken(code);
    console.log(tokens);

    oauth2client.setCredentials(tokens);

    // Get Google user information
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );
console.log(userRes);
    const { name, email, picture } = userRes.data;

    // Check if user already exists
    let newUser = await googleAuthModel.findOne({ email });
  console.log(newUser);
    // Create user if not exists
    if (!newUser) {
      newUser = await googleAuthModel.create({
        name,
        email,
        image: picture,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      newUser,
    });

  } catch (error) {
    console.error("Google Authentication Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  googleLogin,
};