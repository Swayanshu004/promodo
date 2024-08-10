import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const creatorSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true
        },
        instagramUrl: {
            type: String,   
        },
        youtubeUrl: {
            type: String,   
        },
        phoneNo: {
            type: String,   
        },
        category: {
            type:  String,
            required: true
        },
        colabHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
            }
        ],
        password: {
            type: String,
            required: [true , "password is required"],
        },
    }
)
creatorSchema.pre("save" , async function(next){ 
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password , 10)
    next()
})
creatorSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}


export const Creator = mongoose.model("Creator" , creatorSchema);