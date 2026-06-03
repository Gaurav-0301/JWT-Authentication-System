const express = require("express")
const dotenv=require("dotenv").config()

const app=express()
app.use(express.json())
const PORT=process.env.PORT


app.get("/",(req,res)=>{
    res.send("Server is live")
})


app.listen(PORT,(req,res)=>{
    console.log(`Server is up and running on http://localhost:${PORT}`)
})