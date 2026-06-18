const mongoose=require("mongoose");

const googleAuthSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
  },
  image:{
    type:String
  }
});

const googleAuthModel=mongoose.model("googleAuthModel",googleAuthSchema);

module.exports=googleAuthModel;