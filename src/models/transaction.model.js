import mongoose, { Schema } from "mongoose";
const transactionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Processing","Success","Failure"],
        default: "Processing"
    }
},{
    timestamps: true
});


export const transaction = mongoose.model("Transaction" , transactionSchema);