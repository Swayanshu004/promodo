import mongoose, { Schema } from "mongoose";
const postRequestSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "creator"
    },
    requestdOn: {
        type: Schema.Types.ObjectId,
        ref: "post"
    },
    approved: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
});


export const postRequest = mongoose.model("Request" , postRequestSchema);