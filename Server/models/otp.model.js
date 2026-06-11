const mongoose=require("mongoose");
const user=require("./auth.model")
const otpSchema=new mongoose.Schema({
   userId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"users",
          required:true
      },
  otp:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now,
    expire:600,
  }
},
{versionKey:false}
);

const otpModel=mongoose.model("otpModel",otpSchema);
module.exports=otpModel;