const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified:{
      type:Boolean,
      default:false,
    }
    
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", authSchema);

module.exports = User;