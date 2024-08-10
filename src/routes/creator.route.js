import express from "express"
import upload from "../middlewares/multer.middlewares.js"
import {} from "../controllers/creator.controller.js"

const router = express.Router();
router
    .route('/register-creator')
    .post(upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },{
            name: "coverImage",
            maxCount: 1
        }
    ]), reg)