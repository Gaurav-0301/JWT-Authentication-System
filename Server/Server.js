const express = require("express")

const dotenv=require("dotenv").config()
const connectDB =require("./config/db")
const authRouter=require("./routes/auth.router")
const googleAuthRouter=require("./routes/googleAuth.router")
const cors=require("cors")

const cookieParser = require("cookie-parser")
const app=express()
console.log(process.env.PORT)

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser())

const PORT=process.env.PORT

app.use("/",authRouter);
app.use("/auth",googleAuthRouter);

app.get("/",(req,res)=>{
    res.send("Server is live")
})


app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is up and running on http://localhost:${PORT}`);
});