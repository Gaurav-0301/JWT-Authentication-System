const mongoose=require("mongoose");
const user = require("./auth.model");
const sessionSechma=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    refreshTokenHash:{
     type:String,
     required:true
    },
    ip:{
        type:String,
        required:true
    },
    userAgent:{
        type:String,
        required:true
    },
    revoked:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
}
);

const session= mongoose.model("session",sessionSechma);

module.exports=session;