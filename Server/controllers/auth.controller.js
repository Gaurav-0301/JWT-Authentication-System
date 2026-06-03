const user=require("../models/auth.model")

const allUsers=async(req,res)=>{
console.log("Alluser")
}

const signUp=async(req,res)=>{
console.log("signUp")
}

const profileEdit=async(req,res)=>{
console.log("profileEdit")
}

const logout=async(req,res)=>{
console.log("logout")
}

module.exports={allUsers,signUp,profileEdit,logout};