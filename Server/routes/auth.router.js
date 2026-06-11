const express=require("express")
const authRouter=express.Router()
const {getMe,signUp,profileEdit,logout,otpVerification,accessToken,login}  = require("../controllers/auth.controller")


authRouter.post("/auth/getMe",getMe);
authRouter.post("/auth/signUp",signUp);
authRouter.post("/auth/login",login);
authRouter.put("/auth/profileEdit",profileEdit);
authRouter.get("/auth/logout",logout);
authRouter.post("/auth/otpverify/:id",otpVerification);
authRouter.post("/auth/accessToken",accessToken);



module.exports=authRouter;