const mongoose=require("mongoose")

const connectDB=async(req,res)=>{
    try {
        mongoose.connect(process.env.MONGO_URI).then(
            console.log("MongoDB connected...")
        )
    } catch (error) {
        console.log("MongoDB connection error...")
    }
}

module.exports=connectDB