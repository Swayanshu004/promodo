import mongoose, {Schema} from "mongoose"

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ImageUrl: {
        type: String,
        required: true,
    },
    productUrl: {
        type: String,
    },
    category: {
        //  Beauty, sports, tech, finanace... etc.
        type: String,
        required: true
    }, 
    creatorType: {
        //  Beginner, modrate, pro
        type: String,
        required: true
    }, 
    contentType: {
        //  sort(30-120 sec), long(>5min)
        type: String,
        required: true
    }, 
    description: {
        type: String,
    }, 
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Brand"
    },
    pricepoll: {
        //  per promotion
        type: Number,
        required: true,
    },
    autoaccept: {
        type: Boolean,
        default: false,
    }
},{
    timestamps: true
})

export const Post = mongoose.model("Post", postSchema);