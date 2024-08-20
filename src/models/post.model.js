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
        type:  String,
        enum: ["NaN","Lifestyle","Fashion","Beauty","Fitness","Tech","Travel","Food","Gaming","Educational","Parenting"],
        default: "NaN"
    }, 
    creatorType: {
        //  Beginner, Intermediate, Advance
        type:  String,
        enum: ["NaN","Beginner","Intermediate","Advance"],
        default: "NaN"
    }, 
    contentType: {
        //  Short(30-120 sec), Long(>5min)
        type:  String,
        enum: ["NaN","Long","Short"],
        default: "NaN"
    }, 
    description: {
        type: String,
    }, 
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Brand"
    },
    price: {
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