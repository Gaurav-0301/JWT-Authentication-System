const express=require("express")
const authRouter=express.Router()
const {allUsers,signUp,profileEdit,logout}  = require("../controllers/auth.controller")


authRouter.get("/auth/getuser",allUsers);
authRouter.post("/auth/signUp",signUp);
authRouter.put("/auth/profileEdit",profileEdit);
authRouter.delete("/auth/logout",logout);

module.exports=authRouter;