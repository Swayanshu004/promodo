import 'dotenv/config'
import express from "express"
import connectDB from "./db/index.js"

const app = express()

connectDB()
.then(()=>{
    const PORT = process.env.PORT;
    app.listen(PORT,()=>{
        console.log(`- - SERVER STARTED ON PORT : ${PORT} - -`);
    })
})
.catch((err)=>{
    console.error("MongoDB connection failed :- ",err);
})
