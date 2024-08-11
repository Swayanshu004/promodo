import express from "express"
import {Brand} from "../models/brand.model.js"
import {Post} from "../models/post.model.js"
import { upload } from "../middlewares/multer.middlewares.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const router = express.Router();
router
    .post('/signin', async (req, res)=>{
        // const {name, officialURL, category, password} = req.body;\
        const name = "swayanshu";
        const officialUrl = "officialURL.com";
        const category = "beauty";
        const password = "swayanshu123";

        const alletAddress = "I-Am-A-Wallet-Address";
        const existedBrand = await Brand.findOne({
            $or: [{ address: alletAddress }]
        })
        if(existedBrand){
            const token = jwt.sign({
                userId: existedBrand.id,
            }, process.env.JWT_SECRET)

            res.json({token});
        } else {
            const brand = await Brand.create({
                name,
                address: alletAddress,
                officialUrl,
                category,
                password
            })
            const token = jwt.sign({
                userId: brand.id,
            }, process.env.JWT_SECRET)

            res.json({token});
        }
    })
router
    .post('/newpost',upload.single("ImageUrl"), async(req,res)=>{
        let imageLocalPath;
        // console.log("req.files - ",req.file);
        if(req.file){
            // console.log("Cover File Inside - ",req.files.coverImage[0]);
            imageLocalPath = req.file.path;
        } else {
            console.log("no image found in req");
        }
        const cloudinaryLink = await uploadOnCloudinary(imageLocalPath);
        // console.log(imagelink);
        
        const title = "newPost-Demo";
        const ImageUrl = cloudinaryLink.url;
        const category = "Beauty";
        const creatorType = "pro";
        const contentType = "sort";
        const description = "this is a new Product";
        const createdBy = req.body.id;
        const pricepoll = 500;

        const post = await Post.create({
            title,
            ImageUrl,
            category,
            creatorType,
            contentType,
            description,
            createdBy,
            pricepoll
        })
        res.json({post})
    })

export default router; 