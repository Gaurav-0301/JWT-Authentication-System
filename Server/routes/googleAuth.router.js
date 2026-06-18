const express=require("express");
const googleAuthRouter=express.Router();
const {googleLogin}=require("../controllers/googleAuth.controller");

googleAuthRouter.get("/google",googleLogin);
module.exports=googleAuthRouter;