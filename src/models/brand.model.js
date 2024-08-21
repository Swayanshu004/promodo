import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
            unique: true,
            trim:true
        },
        officialUrl: {
            type: String,
            required: true,    
        },
        category: {
            type:  String,
            enum: ["NaN","Lifestyle","Fashion","Beauty","Fitness","Tech","Travel","Food","Gaming","Educational","Parenting"],
            default: "NaN"
        },
        password: {
            type: String,
            required: [true , "password is required"],
        },
    }, {
        timestamps: true
    }
)
brandSchema.pre("save" , async function(next){ 
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password , 10)
    next()
})
brandSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
} 


export const Brand = mongoose.model("Brand" , brandSchema);