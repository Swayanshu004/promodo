import express from "express"
import { Creator } from "../models/creator.model.js"
import { Post } from "../models/post.model.js";
import { postRequest } from "../models/postRequest.model.js";
import jwt from "jsonwebtoken";
import { authMiddlewareCreator } from "../middlewares/authorization.js";
import { Transaction } from "../models/transaction.model.js";


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
                creatorId: creator.id,
            }, process.env.JWT_SECRET_CREATOR)

            res.json({token});
        }
    })
router
    .post('/request/:postId',authMiddlewareCreator, async (req, res)=>{
        const postrequest = await postRequest.create({
            note: "Hii i'm swayanshu",
            createdBy: req.creatorId,
            requestdOn: req.params.postId,
        })
        if(!postrequest){
            res.status(401).send("error in postRequest - try again leter ! !")
        }

        const post = await Post.find({_id: req.params.postId});
        
        const updatedCreator = await Creator.updateOne({_id: req.creatorId}, {$inc: { pendingAmount: post[0].pricepoll}});
        res.status(201).send(updatedCreator);
    })
router
    .get('/balance/:postId', authMiddlewareCreator, async(req, res)=> {
        const creatorId = req.creatorId;
        const creator = await Creator.find({_id: creatorId});
        const post = await Post.find({_id: req.params.postId});
        if(!creator){
            res.status(401),send("Creator not loggedIn");
        }
        if(!post){
            res.status(401),send("post not valid");
        }
        const updatedCreator = creator.update(
            {_id: req.creatorId},
            {
                $inc: { pendingAmount: -post[0].pricepoll},
                $inc: { balanceAmount: post[0].pricepoll}
            }
        )
        const transaction = await Transaction.create({
            userId: "66bd04a6d65f87fd8ac17409",
            amount: 500,
            signature: "0XsomethingXYZ",
        })
        res.status(201).send(updatedCreator, transaction);
    })

export default router; 