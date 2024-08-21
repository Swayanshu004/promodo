import express from "express"
import {Brand} from "../models/brand.model.js"
import {Post} from "../models/post.model.js"
import { Creator } from "../models/creator.model.js";
import { postRequest } from "../models/postRequest.model.js";
import { Transaction } from "../models/transaction.model.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { authMiddlewareBrand } from "../middlewares/authorization.js";


const router = express.Router();
router
    .post('/signin', async (req, res)=>{
        const {name, officialUrl, address, category, password} = req.body;
        const existedBrand = await Brand.findOne({
            $or: [{ address: address }]
        })
        if(existedBrand){
            const token = jwt.sign({
                brandId: existedBrand.id,
            }, process.env.JWT_SECRET)
            res.status(201).json({token});
        } else {
            const brand = await Brand.create({
                name,
                address,
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
        
        const {title, category ,productUrl, creatorType, contentType, description, price, accept} = req.body;
        const ImageUrl = cloudinaryLink.url;

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
        res.status(201).json(brandDetails, allPost)
    })
router
    .get('/post',authMiddlewareBrand, async(req, res)=>{
        const brand = req.brandId;
        const postId = req.query.postId;
        const postDetails = await Post.find({
            $and: [
                {createdBy: brand}, 
                {_id: postId}
            ]
        });
        const allRequest = await postRequest.find({
            requestdOn: postId
        });
        if(!postDetails){
            res.status(401).send("Dont have access to this task / No POST ! !")
        }
        if(!allRequest){
            res.status(401).send("Dont have access to All Request ! !")
        }
        res.status(201).json(postDetails, allRequest);
    }) 
router
    .post('/approve/:postId', authMiddlewareBrand, async(req, res)=> {
        const creator = await Creator.find({_id: req.params.creatorId});
        const post = await Post.find({_id: req.params.postId});
        if(!creator){
            res.status(401),send("Creator not Found");
        }
        if(!post){
            res.status(401),send("postId not valid");
        }
        const updatedCreator = await creator.update(
            {_id: req.creatorId},
            {
                $inc: { pendingAmount: -post[0].pricepoll},
                $inc: { balanceAmount: post[0].pricepoll}
            }
        )
        const transaction = await Transaction.create({
            userId: "66bd04a6d65f87fd8ac17409",
            amount: post[0].pricepoll,
            signature: "0XsomethingXYZ",
        })
        const updateRequest = await postRequest.update(
            {requestdOn: req.req.params.postId},
            {
                $set: { approved: true }
            }
        )
        res.status(201).send("updated");
    })    
export default router; 