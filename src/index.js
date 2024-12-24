import 'dotenv/config'
import express from "express"
import connectDB from "./db/index.js"
import creatorRoute from './routes/creator.route.js'
import brandRoute from './routes/brand.route.js'
import cors from 'cors'

const app = express()
const corsOptions = {
    origin: process.env.ORIGIN,
    methods: "GET, POST, PATCH, DELETE",
    credential: true
  }
app.use(cors(corsOptions))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN); 
  res.header('Access-Control-Allow-Credentials', 'true'); 
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  next();
});
app.options('*', cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

connectDB()
.then(()=>{
    console.log("- - MongoDB Connected - -");
    app.listen(process.env.PORT,()=>{
        console.log(`- - SERVER STARTED ON PORT : ${process.env.PORT} - -`);
    })
}
).catch((err)=>{
    console.error("MongoDB connection failed :- ",err);
})


app.use("/v1/creator", creatorRoute)
app.use("/v1/brand", brandRoute)