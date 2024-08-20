import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"

const creatorSchema = new Schema(
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
            enum: ["NaN","Lifestyle","Fashion","Beauty","Fitness","Tech","Travel","Food","Gaming","Educational","Parenting"],
            default: "NaN"
        },
        password: {
            type: String,
            required: [true , "password is required"],
        },
        balance: {
            type: Number,
            default: 0,
        },
        pendingAmount: {
            type: Number,
            default: 0
        }
    }, {
        timestamps: true
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