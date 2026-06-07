const express = require("express")
const dotenv=require("dotenv").config()
const connectDB =require("./config/db")
const authRouter=require("./routes/auth.router")

const cookieParser = require("cookie-parser")
const app=express()
console.log(process.env.PORT)

app.use(express.json())
app.use(cookieParser())

const PORT=process.env.PORT

app.use("/",authRouter);

app.get("/",(req,res)=>{
    res.send("Server is live")
})


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is up and running on http://localhost:${PORT}`);
});