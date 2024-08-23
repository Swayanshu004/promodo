import express from "express"
import nacl from "tweetnacl";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {Brand} from "../models/brand.model.js"
import {Post} from "../models/post.model.js"
import { Creator } from "../models/creator.model.js";
import { postRequest } from "../models/postRequest.model.js";
import { Transact } from "../models/transaction.model.js"
import { upload } from "../middlewares/multer.middlewares.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { authMiddlewareBrand } from "../middlewares/authorization.js";


const router = express.Router();
router
    .post('/signin', async (req, res)=>{
        console.log(req.body);
        const {name, officialUrl, publicKey, category, password, signature} = req.body;
        console.log(publicKey," - ",signature);
        
        const message = new TextEncoder().encode("Sign into easyPROMO");
        const result = nacl.sign.detached.verify(
            message,
            new Uint8Array(signature.data),
            new PublicKey(publicKey).toBytes(),
        );
        console.log(result);
        if(!result){
            res.status(401).send("unverified Wallet Details.")
        }

        const existedBrand = await Brand.findOne({
            $or: [{ address: publicKey }]
        })
        if(existedBrand){
            const token = jwt.sign({
                brandId: existedBrand.id,
            }, process.env.JWT_SECRET)
            res.status(201).json({token});
        } else {
            const brand = await Brand.create({
                name,
                address: publicKey,
                officialUrl,
                category,
                password
            })
            const token = jwt.sign({
                brandId: brand.id,
            }, process.env.JWT_SECRET)

            res.status(201).json({token});
        }
    })
router
    .post('/newpost',upload.single('ImageUrl'), async(req,res)=>{
        let imageLocalPath;
        console.log(req.file);
        
        try {
            imageLocalPath = req.file.path;
        } catch (error) {
            console.error("no image found in req - ",error);
        }
        const cloudinaryLink = await uploadOnCloudinary(imageLocalPath);
        console.log(cloudinaryLink);
        
        const {title, category ,productUrl, creatorType, contentType, description, price, accept, signature} = req.body;
        const ImageUrl = cloudinaryLink.url;
        if(!signature){
            res.status(401).send("post is not signed by any user")
        }
        console.log(signature);

        const post = await Post.create({
            title,
            ImageUrl,
            productUrl,
            category,
            creatorType,
            contentType,
            description,
            createdBy: "66c4b5e967e8fb483f0f412e",
            price,
            accept,
        })
        res.status(201).send("created");
    })
router
    .get('/profile', authMiddlewareBrand, async(req,res)=>{
        console.log("reached /profile");
        
        const brandId = req.brandId;
        const brandDetails = await Brand.find({
            _id: brandId
        })
        const allPost = await Post.find({
            createdBy: brandId
        })
        if(!brandDetails){
            res.status(401).send("No Brand Exists With This ID.")
        }
        if(!allPost){
            res.status(401).send("No POST Associated With This Brand.")
        }
        res.status(201).json({brandDetails, allPost})
    })
router
    .get('/post/:postId',authMiddlewareBrand, async(req, res)=>{
        const postId = req.params.postId;
        const postDetails = await Post.find({_id: postId});
        if(!postDetails){
            res.status(401).send("Dont have access to this POST ! !")
        }
        const allRequest = await postRequest.find({
            requestdOn: postId
        });
        if(!postDetails){
            res.status(401).send("Dont have access to this No POST ! !")
        }
        if(!allRequest){
            res.status(401).send("Dont have access to All Request ! !")
        }
        res.status(201).json({postDetails, allRequest});
    }) 
router
    .post('/approve/:postId', authMiddlewareBrand, async(req, res)=> {
        console.log(req.query.creatorId);
        console.log(req.params.postId);
        
        const creator = await Creator.find({_id: req.query.creatorId});
        const post = await Post.find({_id: req.params.postId});
        if(!creator){
            res.status(401),send("Creator not Found");
        }
        if(!post){
            res.status(401),send("postId not valid");
        }
        const updatedCreator = await Creator.findOneAndUpdate(
            {_id: req.query.creatorId},
            {
                $inc: { pendingAmount: -post[0].price},
                $inc: { balance: post[0].price}
            }
        )
        const transaction = await Transact.create({
            userId: req.query.creatorId,
            amount: post[0].price,
            signature: "0XsomethingXYZ",
        })
        const updateRequest = await postRequest.findOneAndUpdate(
            {requestdOn: req.params.postId},
            {
                $set: { approved: true }
            }
        )
        res.status(201).json({updatedCreator, updateRequest, transaction});
    })    
export default router; 