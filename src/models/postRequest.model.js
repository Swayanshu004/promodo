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
    }
},{
    timestamps: true
});


export const postRequest = mongoose.model("Request" , postRequestSchema);