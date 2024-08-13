import express from "express"
import {Creator} from "../models/creator.model.js"
import jwt from "jsonwebtoken";


const router = express.Router();
router
    .post('/signin', async (req, res)=>{
        // const {name, socialURl1, socialURL2, phone, category, password} = req.body;
        const name = "Amit";
        const instagramUrl = "igurl.com";
        const youtubeUrl = "yt.com";
        const phoneNo = 23454445;
        const category = "influencer";
        const password = "amit123"
        const alletAddress = "I-Am-A-Wallet-Address";
        const existedUser = await Creator.findOne({
            $or: [{ address: alletAddress }]
        })
        if(existedUser){
            const token = jwt.sign({
                userId: existedUser.id,
            }, process.env.JWT_SECRET)

            res.json({token});
        } else {
            const creator = await Creator.create({
                name,
                address: alletAddress,
                instagramUrl,
                youtubeUrl,
                phoneNo,
                category,
                password
            })
            const token = jwt.sign({
                userId: creator.id,
            }, process.env.JWT_SECRET)

            res.json({token});
        }
    })
router
    .

export default router; 